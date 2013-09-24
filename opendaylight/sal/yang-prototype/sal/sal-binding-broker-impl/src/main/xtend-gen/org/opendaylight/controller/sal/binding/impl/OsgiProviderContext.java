/**
 * Copyright (c) 2013 Cisco Systems, Inc. and others.  All rights reserved.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.controller.sal.binding.impl;

import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.ProviderContext;
import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.RpcServiceRegistration;
import org.opendaylight.controller.sal.binding.impl.BindingAwareBrokerImpl;
import org.opendaylight.controller.sal.binding.impl.Constants;
import org.opendaylight.controller.sal.binding.impl.OsgiConsumerContext;
import org.opendaylight.controller.sal.binding.impl.RpcServiceRegistrationImpl;
import org.opendaylight.controller.sal.binding.impl.utils.PropertiesUtils;
import org.opendaylight.yangtools.yang.binding.RpcService;
import org.osgi.framework.BundleContext;

@SuppressWarnings("all")
public class OsgiProviderContext extends OsgiConsumerContext implements ProviderContext {
  private final Map<Class<? extends RpcService>,RpcServiceRegistrationImpl<? extends RpcService>> _registeredServices;
  
  public Map<Class<? extends RpcService>,RpcServiceRegistrationImpl<? extends RpcService>> getRegisteredServices() {
    return this._registeredServices;
  }
  
  public OsgiProviderContext(final BundleContext ctx, final BindingAwareBrokerImpl broker) {
    super(ctx, broker);
    HashMap<Class<? extends RpcService>,RpcServiceRegistrationImpl<? extends RpcService>> _hashMap = new HashMap<Class<? extends RpcService>,RpcServiceRegistrationImpl<? extends RpcService>>();
    this._registeredServices = _hashMap;
  }
  
  public <T extends RpcService> RpcServiceRegistration<T> addRpcImplementation(final Class<T> type, final T implementation) {
    Hashtable<String,String> _hashtable = new Hashtable<String,String>();
    final Hashtable<String,String> properties = _hashtable;
    PropertiesUtils.setSalServiceType(properties, Constants.SAL_SERVICE_TYPE_PROVIDER);
    final RpcServiceRegistrationImpl<T> salReg = this.broker.<T>registerRpcImplementation(type, implementation, this, properties);
    Map<Class<? extends RpcService>,RpcServiceRegistrationImpl<? extends RpcService>> _registeredServices = this.getRegisteredServices();
    _registeredServices.put(type, salReg);
    return salReg;
  }
}
