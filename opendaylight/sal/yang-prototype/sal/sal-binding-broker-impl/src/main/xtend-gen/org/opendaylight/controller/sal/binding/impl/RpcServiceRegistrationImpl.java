/**
 * Copyright (c) 2013 Cisco Systems, Inc. and others.  All rights reserved.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.controller.sal.binding.impl;

import org.opendaylight.controller.sal.binding.api.BindingAwareBroker.RpcServiceRegistration;
import org.opendaylight.yangtools.yang.binding.RpcService;
import org.osgi.framework.ServiceRegistration;

@SuppressWarnings("all")
public class RpcServiceRegistrationImpl<T extends RpcService> implements RpcServiceRegistration<T> {
  private final ServiceRegistration<T> osgiRegistration;
  
  private final T service;
  
  private final Class<T> cls;
  
  public RpcServiceRegistrationImpl(final Class<T> type, final T service, final ServiceRegistration<T> osgiReg) {
    this.cls = type;
    this.osgiRegistration = osgiReg;
    this.service = service;
  }
  
  public T getService() {
    return this.service;
  }
  
  public void unregister() {
    UnsupportedOperationException _unsupportedOperationException = new UnsupportedOperationException("TODO: auto-generated method stub");
    throw _unsupportedOperationException;
  }
}
