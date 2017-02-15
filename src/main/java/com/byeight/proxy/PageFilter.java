package com.byeight.proxy;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import com.byeight.manifest.bo.Item;
import com.byeight.manifest.bo.Manifest;
import com.byeight.template.IndexGenerator;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
 * Servlet Filter implementation class ManifestFilter
 */
public class PageFilter implements Filter {
    private String aeon = "http://aeon/";
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
        Manifest manifest = get(request.getContextPath(), request);
        IndexGenerator generator = new IndexGenerator(servletContext, getProxyTarget(request));
        writer.write(generator.makeIndexContent(requestURI, manifest));

	}

	/**
	 * Get the Manifest element from the URI
	 * @param origPath
	 * @return Manifest
	 */
    private Manifest get(String contextPath, HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        String origPath = requestURI.substring(contextPath.length()+1);

        Manifest manifest = new Manifest();
        try {
            String json = getManifestContent(origPath, request);
            JsonParser parser = new JsonParser();
            JsonObject object = parser.parse(json).getAsJsonObject();
            JsonArray dirs = object.getAsJsonArray("directories");
            JsonArray imgs = object.getAsJsonArray("images");

            for (int i=0,len=dirs.size(); i<len; i++) {
                String dir = dirs.get(i).getAsString();
                manifest.getDirectories().add(dir);
            }
            for (int i=0,len=imgs.size(); i<len; i++) {
                JsonObject jsonImg = imgs.get(i).getAsJsonObject();
                Item img = new Item();
                img.setUrl(jsonImg.get("lg").getAsString());
                img.setThumb(jsonImg.get("tn").getAsString());
                img.setWidth(jsonImg.get("w").getAsInt());
                img.setHeight(jsonImg.get("h").getAsInt());
                manifest.getItems().add(img);
            }
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return manifest;
    }

    private String getManifestContent(String origPath, HttpServletRequest request) throws IOException {
        String prefix = aeon;
        URL destURL = new URL(prefix + "thumbs/" + origPath + "manifest.json");
        HttpURLConnection conn = (HttpURLConnection) destURL.openConnection();

        conn.connect();
        BufferedReader br = new BufferedReader(new InputStreamReader(
                conn.getInputStream()));
        StringBuffer buff = new StringBuffer();
        String line;
        while ((line = br.readLine()) != null) {
            buff.append(line + "\n");
        }
        br.close();

        return buff.toString();
    }

    private String getProxyTarget(HttpServletRequest request) {
        boolean isLocalhost = false;

        if (request != null) {
            isLocalhost = request.getServerName().equals("localhost");
        }
        String target = isLocalhost ? aeon : "";
        return target;
    }

}
