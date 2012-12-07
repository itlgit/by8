package com.byeight.composer;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class FileCompilerServlet extends HttpServlet {
    /**
     * 
     */
    private static final long serialVersionUID = -6895001037403713052L;
    private ServletContext servletContext;
    private int contextOffset;
    
    private final String dateFormat = "EEE, dd MMM yyyy kk:mm:ss zzz";
    
    private HashMap<String,ContentWorker> workers;
    
    @Override
    public void init(ServletConfig servletConfig) {
        servletContext = servletConfig.getServletContext();
        contextOffset = servletContext.getServletContextName().length() + 1;
        
        workers = new HashMap<String,ContentWorker>(2);
        workers.put("js", new JavaScriptContentWorker(new File(servletContext.getRealPath("/"))));
        workers.put("css", new CSSContentWorker(new File(servletContext.getRealPath("/"))));
    }

    @Override
    public void service(HttpServletRequest request, HttpServletResponse response) {
        
        /*
         * Get the real file path minus the context and servlet names
         */
        int pathOffset = contextOffset + request.getServletPath().length() + 1;
        String filename = request.getRequestURI().substring(pathOffset);
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
}
