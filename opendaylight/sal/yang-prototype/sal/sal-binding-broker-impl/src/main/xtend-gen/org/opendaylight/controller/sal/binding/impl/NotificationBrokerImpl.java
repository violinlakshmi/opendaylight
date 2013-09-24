/**
 * Copyright (c) 2013 Cisco Systems, Inc. and others.  All rights reserved.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.controller.sal.binding.impl;

import com.google.common.base.Objects;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.Multimap;
import java.util.Collection;
import java.util.concurrent.ExecutorService;
import org.eclipse.xtext.xbase.lib.Conversions;
import org.eclipse.xtext.xbase.lib.Functions.Function1;
import org.eclipse.xtext.xbase.lib.IterableExtensions;
import org.eclipse.xtext.xbase.lib.Procedures.Procedure1;
import org.opendaylight.controller.sal.binding.api.NotificationListener;
import org.opendaylight.controller.sal.binding.api.NotificationProviderService;
import org.opendaylight.yangtools.yang.binding.Notification;

@SuppressWarnings("all")
public class NotificationBrokerImpl implements NotificationProviderService {
  private final Multimap<Class<? extends Notification>,NotificationListener<? extends Object>> listeners;
  
  private final ExecutorService executor;
  
  public NotificationBrokerImpl(final ExecutorService executor) {
    HashMultimap<Class<? extends Notification>,NotificationListener<? extends Object>> _create = HashMultimap.<Class<? extends Notification>, NotificationListener<? extends Object>>create();
    this.listeners = _create;
    this.executor = executor;
  }
  
  public <T extends Notification> void addNotificationListener(final Class<T> notificationType, final NotificationListener<T> listener) {
    this.listeners.put(notificationType, listener);
  }
  
  public <T extends Notification> void removeNotificationListener(final Class<T> notificationType, final NotificationListener<T> listener) {
    this.listeners.remove(notificationType, listener);
  }
  
  public void notify(final Notification notification) {
    Iterable<Class<? extends Object>> _notificationTypes = this.getNotificationTypes(notification);
    final Procedure1<Class<? extends Object>> _function = new Procedure1<Class<? extends Object>>() {
        public void apply(final Class<? extends Object> it) {
          Collection<NotificationListener<? extends Object>> _get = NotificationBrokerImpl.this.listeners.get(((Class<? extends Notification>) it));
          if (_get!=null) {
            NotificationBrokerImpl.this.notifyAll(_get, notification);
          }
        }
      };
    IterableExtensions.<Class<? extends Object>>forEach(_notificationTypes, _function);
  }
  
  public Iterable<Class<? extends Object>> getNotificationTypes(final Notification notification) {
    Class<? extends Notification> _class = notification.getClass();
    Class<? extends Object>[] _interfaces = _class.getInterfaces();
    final Function1<Class<? extends Object>,Boolean> _function = new Function1<Class<? extends Object>,Boolean>() {
        public Boolean apply(final Class<? extends Object> it) {
          boolean _and = false;
          boolean _notEquals = (!Objects.equal(it, Notification.class));
          if (!_notEquals) {
            _and = false;
          } else {
            boolean _isAssignableFrom = Notification.class.isAssignableFrom(it);
            _and = (_notEquals && _isAssignableFrom);
          }
          return Boolean.valueOf(_and);
        }
      };
    Iterable<Class<? extends Object>> _filter = IterableExtensions.<Class<? extends Object>>filter(((Iterable<Class<? extends Object>>)Conversions.doWrapArray(_interfaces)), _function);
    return _filter;
  }
  
  public void notifyAll(final Collection<NotificationListener<? extends Object>> listeners, final Notification notification) {
    final Procedure1<NotificationListener<? extends Object>> _function = new Procedure1<NotificationListener<? extends Object>>() {
        public void apply(final NotificationListener<? extends Object> it) {
          ((NotificationListener) it).onNotification(notification);
        }
      };
    IterableExtensions.<NotificationListener<? extends Object>>forEach(listeners, _function);
  }
}
