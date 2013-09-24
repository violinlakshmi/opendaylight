/**
 * Copyright (c) 2013 Cisco Systems, Inc. and others.  All rights reserved.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.controller.sal.binding.impl;

import com.google.common.base.Objects;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import javassist.ClassPath;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtField;
import javassist.CtMethod;
import javassist.LoaderClassPath;
import javassist.Modifier;
import org.eclipse.xtend2.lib.StringConcatenation;
import org.eclipse.xtext.xbase.lib.Conversions;
import org.eclipse.xtext.xbase.lib.Exceptions;
import org.eclipse.xtext.xbase.lib.Functions.Function0;
import org.eclipse.xtext.xbase.lib.Functions.Function1;
import org.eclipse.xtext.xbase.lib.IterableExtensions;
import org.eclipse.xtext.xbase.lib.Procedures.Procedure1;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ConsumerContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareConsumer;
import org.opendaylight.controller.sal.binding.api.BindingAwareProvider;
import org.opendaylight.controller.sal.binding.api.NotificationProviderService;
import org.opendaylight.controller.sal.binding.api.NotificationService;
import org.opendaylight.controller.sal.binding.impl.Constants;
import org.opendaylight.controller.sal.binding.impl.NotificationBrokerImpl;
import org.opendaylight.controller.sal.binding.impl.OsgiConsumerContext;
import org.opendaylight.controller.sal.binding.impl.OsgiProviderContext;
import org.opendaylight.controller.sal.binding.impl.RpcProxyContext;
import org.opendaylight.controller.sal.binding.impl.RpcServiceRegistrationImpl;
import org.opendaylight.controller.sal.binding.impl.utils.GeneratorUtils;
import org.opendaylight.controller.sal.binding.impl.utils.PropertiesUtils;
import org.opendaylight.yangtools.yang.binding.RpcService;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceRegistration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("all")
public class BindingAwareBrokerImpl implements BindingAwareBroker {
  private final static String DELEGATE_FIELD = "_delegate";
  
  private final static Logger log = new Function0<Logger>() {
    public Logger apply() {
      Logger _logger = LoggerFactory.getLogger(BindingAwareBrokerImpl.class);
      return _logger;
    }
  }.apply();
  
  private final ClassPool clsPool = new Function0<ClassPool>() {
    public ClassPool apply() {
      ClassPool _default = ClassPool.getDefault();
      return _default;
    }
  }.apply();
  
  private Map<Class<? extends RpcService>,RpcProxyContext> managedProxies = new Function0<Map<Class<? extends RpcService>,RpcProxyContext>>() {
    public Map<Class<? extends RpcService>,RpcProxyContext> apply() {
      HashMap<Class<? extends RpcService>,RpcProxyContext> _hashMap = new HashMap<Class<? extends RpcService>,RpcProxyContext>();
      return _hashMap;
    }
  }.apply();
  
  private NotificationBrokerImpl notifyBroker;
  
  private ServiceRegistration<NotificationProviderService> notifyBrokerRegistration;
  
  private BundleContext _brokerBundleContext;
  
  public BundleContext getBrokerBundleContext() {
    return this._brokerBundleContext;
  }
  
  public void setBrokerBundleContext(final BundleContext brokerBundleContext) {
    this._brokerBundleContext = brokerBundleContext;
  }
  
  public ServiceRegistration<NotificationService> start() {
    ServiceRegistration<NotificationService> _xblockexpression = null;
    {
      this.initGenerator();
      NotificationBrokerImpl _notificationBrokerImpl = new NotificationBrokerImpl(null);
      this.notifyBroker = _notificationBrokerImpl;
      final Hashtable<String,String> brokerProperties = PropertiesUtils.newProperties();
      BundleContext _brokerBundleContext = this.getBrokerBundleContext();
      ServiceRegistration<NotificationProviderService> _registerService = _brokerBundleContext.<NotificationProviderService>registerService(NotificationProviderService.class, this.notifyBroker, brokerProperties);
      this.notifyBrokerRegistration = _registerService;
      BundleContext _brokerBundleContext_1 = this.getBrokerBundleContext();
      ServiceRegistration<NotificationService> _registerService_1 = _brokerBundleContext_1.<NotificationService>registerService(NotificationService.class, this.notifyBroker, brokerProperties);
      _xblockexpression = (_registerService_1);
    }
    return _xblockexpression;
  }
  
  public ClassPath initGenerator() {
    ClassLoader _classLoader = RpcService.class.getClassLoader();
    LoaderClassPath _loaderClassPath = new LoaderClassPath(_classLoader);
    ClassPath _appendClassPath = this.clsPool.appendClassPath(_loaderClassPath);
    return _appendClassPath;
  }
  
  public ConsumerContext registerConsumer(final BindingAwareConsumer consumer, final BundleContext bundleCtx) {
    final OsgiConsumerContext ctx = this.createContext(consumer, bundleCtx);
    consumer.onSessionInitialized(ctx);
    return ctx;
  }
  
  public ProviderContext registerProvider(final BindingAwareProvider provider, final BundleContext bundleCtx) {
    final OsgiProviderContext ctx = this.createContext(provider, bundleCtx);
    provider.onSessionInitialized(ctx);
    provider.onSessionInitiated(((ProviderContext) ctx));
    return ctx;
  }
  
  private OsgiConsumerContext createContext(final BindingAwareConsumer consumer, final BundleContext consumerCtx) {
    OsgiConsumerContext _osgiConsumerContext = new OsgiConsumerContext(consumerCtx, this);
    return _osgiConsumerContext;
  }
  
  private OsgiProviderContext createContext(final BindingAwareProvider provider, final BundleContext providerCtx) {
    OsgiProviderContext _osgiProviderContext = new OsgiProviderContext(providerCtx, this);
    return _osgiProviderContext;
  }
  
  /**
   * Returns a Managed Direct Proxy for supplied class
   * 
   * Managed direct proxy is a generated proxy class conforming to the supplied interface
   * which delegates all calls to the backing delegate.
   * 
   * Proxy does not do any validation, null pointer checks or modifies data in any way, it
   * is only use to avoid exposing direct references to backing implementation of service.
   * 
   * If proxy class does not exist for supplied service class it will be generated automatically.
   */
  public <T extends RpcService> RpcService getManagedDirectProxy(final Class<T> service) {
    try {
      RpcProxyContext existing = null;
      RpcProxyContext _get = this.managedProxies.get(service);
      RpcProxyContext _existing = existing = _get;
      boolean _notEquals = (!Objects.equal(_existing, null));
      if (_notEquals) {
        return existing.getProxy();
      }
      final Class proxyClass = this.generateDirectProxy(service);
      RpcProxyContext _rpcProxyContext = new RpcProxyContext(proxyClass);
      final RpcProxyContext rpcProxyCtx = _rpcProxyContext;
      Hashtable<String,String> _hashtable = new Hashtable<String,String>();
      final Hashtable<String,String> properties = _hashtable;
      Object _newInstance = proxyClass.newInstance();
      rpcProxyCtx.setProxy(((RpcService) _newInstance));
      PropertiesUtils.setSalServiceType(properties, Constants.SAL_SERVICE_TYPE_CONSUMER_PROXY);
      BundleContext _brokerBundleContext = this.getBrokerBundleContext();
      RpcService _proxy = rpcProxyCtx.getProxy();
      ServiceRegistration<T> _registerService = _brokerBundleContext.<T>registerService(service, ((T) _proxy), properties);
      rpcProxyCtx.setRegistration(_registerService);
      this.managedProxies.put(service, rpcProxyCtx);
      return rpcProxyCtx.getProxy();
    } catch (Throwable _e) {
      throw Exceptions.sneakyThrow(_e);
    }
  }
  
  protected Class generateDirectProxy(final Class<? extends RpcService> delegate) {
    try {
      final String targetFqn = GeneratorUtils.generatedName(delegate, Constants.PROXY_DIRECT_SUFFIX);
      BindingAwareBrokerImpl.log.debug("Generating DirectProxy for {} Proxy name: {}", delegate, targetFqn);
      final CtClass objCls = GeneratorUtils.get(this.clsPool, Object.class);
      final CtClass delegateCls = GeneratorUtils.get(this.clsPool, delegate);
      final CtClass proxyCls = this.clsPool.makeClass(targetFqn);
      proxyCls.addInterface(delegateCls);
      CtField _ctField = new CtField(delegateCls, BindingAwareBrokerImpl.DELEGATE_FIELD, proxyCls);
      final CtField delField = _ctField;
      delField.setModifiers(Modifier.PUBLIC);
      proxyCls.addField(delField);
      CtMethod[] _methods = delegateCls.getMethods();
      final Function1<CtMethod,Boolean> _function = new Function1<CtMethod,Boolean>() {
          public Boolean apply(final CtMethod it) {
            CtClass _declaringClass = it.getDeclaringClass();
            boolean _notEquals = (!Objects.equal(_declaringClass, objCls));
            return Boolean.valueOf(_notEquals);
          }
        };
      Iterable<CtMethod> _filter = IterableExtensions.<CtMethod>filter(((Iterable<CtMethod>)Conversions.doWrapArray(_methods)), _function);
      final Procedure1<CtMethod> _function_1 = new Procedure1<CtMethod>() {
          public void apply(final CtMethod it) {
            try {
              CtMethod _ctMethod = new CtMethod(it, proxyCls, null);
              final CtMethod proxyMethod = _ctMethod;
              StringConcatenation _builder = new StringConcatenation();
              _builder.append("return ($r) ");
              _builder.append(BindingAwareBrokerImpl.DELEGATE_FIELD, "");
              _builder.append(".");
              String _name = it.getName();
              _builder.append(_name, "");
              _builder.append("($$);");
              proxyMethod.setBody(_builder.toString());
              proxyCls.addMethod(proxyMethod);
            } catch (Throwable _e) {
              throw Exceptions.sneakyThrow(_e);
            }
          }
        };
      IterableExtensions.<CtMethod>forEach(_filter, _function_1);
      try {
        ClassLoader _classLoader = delegate.getClassLoader();
        return proxyCls.toClass(_classLoader);
      } catch (Throwable _e) {
        throw Exceptions.sneakyThrow(_e);
      }
    } catch (Throwable _e_1) {
      throw Exceptions.sneakyThrow(_e_1);
    }
  }
  
  /**
   * Registers RPC Implementation
   */
  public <T extends RpcService> RpcServiceRegistrationImpl<T> registerRpcImplementation(final Class<T> type, final T service, final OsgiProviderContext context, final Hashtable<String,String> properties) {
    final RpcService proxy = this.<T>getManagedDirectProxy(type);
    RpcService _delegate = this.<RpcService>getDelegate(proxy);
    boolean _notEquals = (!Objects.equal(_delegate, null));
    if (_notEquals) {
      String _plus = ("Service " + type);
      String _plus_1 = (_plus + "is already registered");
      IllegalStateException _illegalStateException = new IllegalStateException(_plus_1);
      throw _illegalStateException;
    }
    final ServiceRegistration<T> osgiReg = context.bundleContext.<T>registerService(type, service, properties);
    this.setDelegate(proxy, service);
    RpcServiceRegistrationImpl<T> _rpcServiceRegistrationImpl = new RpcServiceRegistrationImpl<T>(type, service, osgiReg);
    return _rpcServiceRegistrationImpl;
  }
  
  /**
   * Helper method to return delegate from ManagedDirectedProxy with use of reflection.
   * 
   * Note: This method uses reflection, but access to delegate field should be
   * avoided and called only if neccessary.
   */
  public <T extends RpcService> T getDelegate(final RpcService proxy) {
    try {
      Class<? extends RpcService> _class = proxy.getClass();
      final Field field = _class.getField(BindingAwareBrokerImpl.DELEGATE_FIELD);
      boolean _equals = Objects.equal(field, null);
      if (_equals) {
        UnsupportedOperationException _unsupportedOperationException = new UnsupportedOperationException("Unable to get delegate from proxy");
        throw _unsupportedOperationException;
      }
      try {
        Object _get = field.get(proxy);
        return ((T) _get);
      } catch (Throwable _e) {
        throw Exceptions.sneakyThrow(_e);
      }
    } catch (Throwable _e_1) {
      throw Exceptions.sneakyThrow(_e_1);
    }
  }
  
  /**
   * Helper method to set delegate to ManagedDirectedProxy with use of reflection.
   * 
   * Note: This method uses reflection, but setting delegate field should not occur too much
   * to introduce any significant performance hits.
   */
  public void setDelegate(final RpcService proxy, final RpcService delegate) {
    try {
      Class<? extends RpcService> _class = proxy.getClass();
      final Field field = _class.getField(BindingAwareBrokerImpl.DELEGATE_FIELD);
      boolean _equals = Objects.equal(field, null);
      if (_equals) {
        UnsupportedOperationException _unsupportedOperationException = new UnsupportedOperationException("Unable to set delegate to proxy");
        throw _unsupportedOperationException;
      }
      Class<? extends Object> _type = field.getType();
      Class<? extends RpcService> _class_1 = delegate.getClass();
      boolean _isAssignableFrom = _type.isAssignableFrom(_class_1);
      if (_isAssignableFrom) {
        field.set(proxy, delegate);
      } else {
        IllegalArgumentException _illegalArgumentException = new IllegalArgumentException("delegate class is not assignable to proxy");
        throw _illegalArgumentException;
      }
    } catch (Throwable _e) {
      throw Exceptions.sneakyThrow(_e);
    }
  }
}
