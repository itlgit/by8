package com.byeight.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class ManifestProxy
 */
public class ManifestProxy extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private String proxyTarget;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ManifestProxy() {
        super();
    }
    
    @Override
    public void init(ServletConfig config) {
        String proxyTarget = System.getProperty("manifest.proxy.target");
        this.proxyTarget = proxyTarget;
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String origPath = request.getRequestURI();
        String contextPath = request.getContextPath();
        origPath = origPath.substring(contextPath.length());
        String queryString = request.getQueryString();
        queryString = queryString == null ? "" : "?"+queryString;
        URL destURL = new URL(proxyTarget+origPath+queryString);
        HttpURLConnection conn = (HttpURLConnection) destURL.openConnection();
        
        /*
         * Proxy request headers
         */
        Enumeration<String> requestHeaderFields = request.getHeaderNames();
        while (requestHeaderFields.hasMoreElements()) {
            String key = requestHeaderFields.nextElement();
            conn.addRequestProperty(key, request.getHeader(key));
        }
        
        String httpProxy = System.getProperty("http.proxyHost");
        if (httpProxy != null) {
            System.out.println("-->"+httpProxy+" -->"+conn.getURL().toString());
        }
        conn.connect();
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuffer buff = new StringBuffer();
        String line;
        while ((line = br.readLine()) != null) {
            buff.append(line+"\n");
        }
        br.close();
        
        /*
         * Proxy response headers
         */
        Map<String, List<String>> responseHeaderFields = conn.getHeaderFields();
        Set<String> keys = responseHeaderFields.keySet();
        String statusCode = responseHeaderFields.get(null).get(0).split("\\s")[1];
        for (String key : keys) {
            if (key == null) {
                continue;
            }
            String value = conn.getHeaderField(key);
            response.setHeader(key, value);
        }
        
        response.setStatus(Integer.parseInt(statusCode));
        PrintWriter pr = response.getWriter();
        pr.print(buff.toString());
        pr.close();
	}
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    doGet(request, response);
	}

}
