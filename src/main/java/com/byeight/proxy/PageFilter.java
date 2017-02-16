package com.byeight.proxy;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import com.byeight.manifest.bo.Manifest;
import com.byeight.template.IndexGenerator;

/**
 * Servlet Filter implementation class ManifestFilter
 */
public class PageFilter implements Filter {
    private ServletContext servletContext;

    /**
     * Default constructor.
     */
    public PageFilter() {
        // TODO Auto-generated constructor stub
    }

    /**
     * @see Filter#init(FilterConfig)
     */
    @Override
    public void init(FilterConfig fConfig) throws ServletException {
        servletContext = fConfig.getServletContext();
    }

	/**
	 * @see Filter#destroy()
	 */
	@Override
    public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	@Override
    public void doFilter(ServletRequest freq, ServletResponse fresp, FilterChain chain) throws IOException, ServletException {
	    HttpServletRequest request = (HttpServletRequest)freq;
	    String requestURI = request.getRequestURI();

	    if (!requestURI.endsWith("/")) {
	        chain.doFilter(freq, fresp);
	        return;
	    }

        fresp.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = fresp.getWriter();
        String contextPath = request.getContextPath();
        String uri = requestURI.substring(contextPath.length()+1);
        Manifest manifest = ManifestProxy.get(uri);
        IndexGenerator generator = new IndexGenerator(servletContext, getProxyTarget(request));
        writer.write(generator.makeIndexContent(requestURI, manifest));

	}

    private String getProxyTarget(HttpServletRequest request) {
        boolean isLocalhost = false;

        if (request != null) {
            isLocalhost = request.getServerName().equals("localhost");
        }
        String target = isLocalhost ? Configuration.getAeonPrefix() : "";
        return target;
    }

}
