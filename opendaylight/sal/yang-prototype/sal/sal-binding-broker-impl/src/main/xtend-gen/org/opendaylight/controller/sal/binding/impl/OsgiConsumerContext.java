package org.opendaylight.controller.sal.binding.impl;

import java.util.Collection;
import java.util.Iterator;
import org.eclipse.xtend2.lib.StringConcatenation;
import org.eclipse.xtext.xbase.lib.Exceptions;
import org.eclipse.xtext.xbase.lib.Functions.Function0;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ConsumerContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareService;
import org.opendaylight.controller.sal.binding.impl.BindingAwareBrokerImpl;
import org.opendaylight.controller.sal.binding.impl.Constants;
import org.opendaylight.yangtools.yang.binding.RpcService;
import org.osgi.framework.BundleContext;
import org.osgi.framework.InvalidSyntaxException;
import org.osgi.framework.ServiceReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("all")
public class OsgiConsumerContext implements ConsumerContext {
  private final static Logger log = new Function0<Logger>() {
    public Logger apply() {
      Logger _logger = LoggerFactory.getLogger(OsgiConsumerContext.class);
      return _logger;
    }
  }.apply();
  
  protected final BundleContext bundleContext;
  
  protected final BindingAwareBrokerImpl broker;
  
  public OsgiConsumerContext(final BundleContext ctx, final BindingAwareBrokerImpl broker) {
    this.bundleContext = ctx;
    this.broker = broker;
  }
  
  public <T extends BindingAwareService> T getSALService(final Class<T> service) {
    ServiceReference<T> ref = this.bundleContext.<T>getServiceReference(service);
    T _service = this.bundleContext.<T>getService(ref);
    return ((T) _service);
  }
  
  public <T extends RpcService> T getRpcService(final Class<T> module) {
    try {
      String _proxyFilter = this.getProxyFilter();
      final Collection<ServiceReference<T>> services = this.bundleContext.<T>getServiceReferences(module, _proxyFilter);
      boolean _isEmpty = services.isEmpty();
      boolean _equals = (false == _isEmpty);
      if (_equals) {
        Iterator<ServiceReference<T>> _iterator = services.iterator();
        ServiceReference<T> _next = _iterator.next();
        final ServiceReference<T> ref = ((ServiceReference<T>) _next);
        T _service = this.bundleContext.<T>getService(ref);
        return ((T) _service);
      }
    } catch (final Throwable _t) {
      if (_t instanceof InvalidSyntaxException) {
        final InvalidSyntaxException e = (InvalidSyntaxException)_t;
        String _message = e.getMessage();
        OsgiConsumerContext.log.error("Created filter was invalid:", _message, e);
      } else {
        throw Exceptions.sneakyThrow(_t);
      }
    }
    return null;
  }
  
  private String getProxyFilter() {
    StringConcatenation _builder = new StringConcatenation();
    _builder.append("(");
    _builder.append(Constants.SAL_SERVICE_TYPE, "");
    _builder.append("=");
    _builder.append(Constants.SAL_SERVICE_TYPE_CONSUMER_PROXY, "");
    _builder.append(")");
    return _builder.toString();
  }
}
