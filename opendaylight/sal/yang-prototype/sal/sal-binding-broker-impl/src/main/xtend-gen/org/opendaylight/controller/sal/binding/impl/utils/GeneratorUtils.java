/**
 * Copyright (c) 2013 Cisco Systems, Inc. and others.  All rights reserved.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.opendaylight.controller.sal.binding.impl.utils;

import javassist.ClassPool;
import javassist.CtClass;
import javassist.LoaderClassPath;
import javassist.NotFoundException;
import org.eclipse.xtend2.lib.StringConcatenation;
import org.eclipse.xtext.xbase.lib.Exceptions;

@SuppressWarnings("all")
public class GeneratorUtils {
  private final static String PREFIX = "_gen.";
  
  public static String generatedName(final Class<? extends Object> cls, final String suffix) {
    StringConcatenation _builder = new StringConcatenation();
    _builder.append(GeneratorUtils.PREFIX, "");
    Package _package = cls.getPackage();
    String _name = _package.getName();
    _builder.append(_name, "");
    _builder.append(".");
    String _simpleName = cls.getSimpleName();
    _builder.append(_simpleName, "");
    _builder.append("$");
    _builder.append(suffix, "");
    String _string = _builder.toString();
    return _string;
  }
  
  public static CtClass get(final ClassPool pool, final Class<? extends Object> cls) {
    try {
      try {
        String _name = cls.getName();
        return pool.get(_name);
      } catch (Throwable _e) {
        throw Exceptions.sneakyThrow(_e);
      }
    } catch (final Throwable _t) {
      if (_t instanceof NotFoundException) {
        final NotFoundException e = (NotFoundException)_t;
        ClassLoader _classLoader = cls.getClassLoader();
        LoaderClassPath _loaderClassPath = new LoaderClassPath(_classLoader);
        pool.appendClassPath(_loaderClassPath);
        try {
          String _name_1 = cls.getName();
          return pool.get(_name_1);
        } catch (Throwable _e_1) {
          throw Exceptions.sneakyThrow(_e_1);
        }
      } else {
        throw Exceptions.sneakyThrow(_t);
      }
    }
  }
}
