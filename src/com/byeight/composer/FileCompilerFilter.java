package com.byeight.composer;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class FileCompilerFilter implements Filter {
    /**
     * 
     */
    private ServletContext servletContext;
    
    private final String dateFormat = "EEE, dd MMM yyyy kk:mm:ss zzz";
    
    private HashMap<String,ContentWorker> workers;
    
    @Override
    public void init(FilterConfig filterConfig) {
        servletContext = filterConfig.getServletContext();
        
        workers = new HashMap<String,ContentWorker>(2);
        workers.put("js", new JavaScriptContentWorker(new File(servletContext.getRealPath("/"))));
        workers.put("css", new CSSContentWorker(new File(servletContext.getRealPath("/"))));
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
            FilterChain chain) throws IOException, ServletException {
        
        if (!"true".equals(req.getParameter("compiled"))) {
            chain.doFilter(req, res);
            return;
        }
        
        HttpServletRequest request = (HttpServletRequest)req;
        HttpServletResponse response = (HttpServletResponse)res;
        String contextPath = request.getContextPath();
        String filename = request.getRequestURI().substring(contextPath.length());
        String extension = getFileExtension(filename);
        String addlModule = request.getParameter("m");
        ContentWorker worker = workers.get(extension);
        try {
            Date requestCacheDate = getRequestCacheDate(request);
            long lastModified = worker.lastModified(filename);
            if (requestCacheDate != null &&
                    requestCacheDate.getTime() >= lastModified) {
                response.setStatus(304);
                return;
            }
            
            SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
            response.addHeader("Last-Modified", sdf.format(new Date()));
            
            response.setContentType(worker.getContentType());
            StringBuffer contents = new StringBuffer(worker.getContents(filename));
            if (addlModule != null && !"".equals(addlModule)) {
                contents.append(worker.getContents(addlModule));
            }
            response.setContentLength(contents.length());
            PrintWriter pr = response.getWriter();
            pr.print(contents.toString());
            pr.flush();
        } catch (IOException e) {
            System.err.println(e.getMessage());
            response.setStatus(404);
        }
    }
    
    private Date getRequestCacheDate(HttpServletRequest request) {
        String modifiedStr = request.getHeader("If-Modified-Since");
        if (modifiedStr != null) {
            SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
            try {
                Date requestCacheDate = sdf.parse(modifiedStr);
                return requestCacheDate;
            } catch (Exception ex) {
            }
        }
        return null;
    }
    
    private String getFileExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        return filename.substring(dot+1);
    }

    @Override
    public void destroy() {
        // TODO Auto-generated method stub
        
    }

}
