/**
 * Copyright (c) 2013 Cisco Systems, Inc. and others.  All rights reserved.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.controller.sal.binding.impl.utils;

import java.util.Hashtable;
import org.opendaylight.controller.sal.binding.impl.Constants;

@SuppressWarnings("all")
public class PropertiesUtils {
  private PropertiesUtils() {
  }
  
  public static Hashtable<String,String> setSalServiceType(final Hashtable<String,String> properties, final String value) {
    properties.put(Constants.SAL_SERVICE_TYPE, value);
    return properties;
  }
  
  public static String getSalServiceType(final Hashtable<String,String> properties) {
    return properties.get(Constants.SAL_SERVICE_TYPE);
  }
  
  public static Hashtable<String,String> newProperties() {
    Hashtable<String,String> _hashtable = new Hashtable<String,String>();
    return _hashtable;
  }
}
