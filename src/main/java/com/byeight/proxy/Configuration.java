package com.byeight.proxy;

public class Configuration {
    public static String getAeonPrefix() {
        String aeon = "http://aeon/";
        String proxyTarget = System.getProperty("proxy.target");
        if (proxyTarget != null && proxyTarget.length() > 0) {
            aeon = proxyTarget;
        }
        return aeon;
    }
}
