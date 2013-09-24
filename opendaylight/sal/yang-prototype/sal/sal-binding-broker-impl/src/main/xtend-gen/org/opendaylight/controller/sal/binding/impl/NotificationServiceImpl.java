/**
 * Copyright (c) 2013 Cisco Systems, Inc. and others.  All rights reserved.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.controller.sal.binding.impl;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Multimap;
import org.opendaylight.controller.sal.binding.api.NotificationListener;
import org.opendaylight.controller.sal.binding.api.NotificationService;
import org.opendaylight.yangtools.yang.binding.Notification;

@SuppressWarnings("all")
public class NotificationServiceImpl implements NotificationService {
  private final Multimap<Class<? extends Notification>,NotificationListener<? extends Object>> listeners;
  
  public NotificationServiceImpl() {
    HashMultimap<Class<? extends Notification>,NotificationListener<? extends Object>> _create = HashMultimap.<Class<? extends Notification>, NotificationListener<? extends Object>>create();
    this.listeners = _create;
  }
  
  public <T extends Notification> void addNotificationListener(final Class<T> notificationType, final NotificationListener<T> listener) {
    this.listeners.put(notificationType, listener);
  }
  
  public <T extends Notification> void removeNotificationListener(final Class<T> notificationType, final NotificationListener<T> listener) {
    this.listeners.remove(notificationType, listener);
  }
}
