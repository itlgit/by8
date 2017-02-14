package com.byeight.proxy;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.util.List;

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
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
 * Servlet Filter implementation class ManifestFilter
 */
public class ManifestFilter implements Filter {
    private ServletContext servletContext;
    private String proxyTarget;
    private String aeon = "http://aeon/";

    /**
     * Default constructor.
     */
    public ManifestFilter() {
        // TODO Auto-generated constructor stub
    }

    /**
     * @see Filter#init(FilterConfig)
     */
    @Override
    public void init(FilterConfig fConfig) throws ServletException {
        servletContext = fConfig.getServletContext();
        String proxyTarget = System.getProperty("manifest.proxy.target");
        if (proxyTarget == null || proxyTarget.length() == 0) {
            proxyTarget = "";
        }
        this.proxyTarget = proxyTarget;
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

        String origPath = request.getRequestURI();
        String contextPath = request.getContextPath();
        origPath = origPath.substring(contextPath.length()+1);

        fresp.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = fresp.getWriter();
        Manifest manifest = get(origPath);
        StringBuffer nav = getNavigatorHtml(origPath);
        StringBuffer dirs = getDirectoryHtml(manifest.getDirectories(), origPath);
        StringBuffer imgs = getItemsHtml(manifest.getItems(), origPath);
        writer.write(makeIndexContent(requestURI, nav, dirs, imgs));

	}

	/**
	 * Get the Manifest element from the URI
	 * @param origPath
	 * @return Manifest
	 */
    private Manifest get(String origPath) {
        Manifest manifest = new Manifest();
        try {
            String json = getManifestContent(origPath);
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

    private String getManifestContent(String origPath) throws IOException {
        String prefix = getProxyTarget();
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

    private StringBuffer getDirectoryHtml(List<String> items, String prefix) {
        StringBuffer buffer = new StringBuffer();
        for (int i=0,len=items.size(); i<len; i++) {
            String item = items.get(i);
            String link = makeLink(prefix, item);
            String sep = " |";
            if (i == len - 1) {
                sep = "";
            }
            buffer.append(link+sep+"\n");
        }
        return buffer;
    }

    private String makeLink(String prefix, String item) {
        try {
            prefix = URLDecoder.decode(prefix, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        if (prefix.endsWith("/")) {
            item = item.substring(prefix.length());
        }
        int lastSlash = item.lastIndexOf('/');
        String basename = item.substring(lastSlash+1);
        return "<a href=\""+item+"/\">"+basename+"</a>";
    }

    private StringBuffer getItemsHtml(List<Item> items, String origPath) {
        StringBuffer buffer = new StringBuffer();
        for (int i=0,len=items.size(); i<len; i++) {
            Item image = items.get(i);
            String link = makeLink(origPath, image);
            buffer.append(link+"\n");
        }
        return buffer;
    }

    private String makeLink(String prefix, Item item) {
        String url = item.getUrl();
        String type = item.getType();
        String thumb = item.getThumb();
        String filename = url;
        int last = filename.lastIndexOf('/');
        if (last > -1) {
            filename = filename.substring(last);
        }
        int width = item.getWidth();
        int height = item.getHeight();
        String fullUrl = getProxyTarget()+url;
        String fullThumb = getProxyTarget()+thumb;
        return  "<a class=\"thumbnail-link\" title=\""+filename+"\" data-thumbnail=\""+thumb+"\" data-type=\""+type+"\" href=\""+fullUrl+"\">"+
                "<img class=\"thumbnail\" src=\""+fullThumb+"\" width=\""+width+"\" height=\""+height+"\">"+
                (type == Item.VIDEO_TYPE ? "<i class=\"fa fa-play fa-lg\"></i>" : "")+
                "</a>";
    }

    private StringBuffer getNavigatorHtml(String currentPath) {
        StringBuffer html = new StringBuffer();
        String[] paths = currentPath.split("\\/");
        StringBuffer accum = new StringBuffer();

        for (int len=paths.length,i=len-1; i>=0; i--) {
            String path = paths[i];
            try {
                path = URLDecoder.decode(paths[i], "UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if (i == len - 1) {
                if (!"".equals(path)) {
                    html.insert(0, "<li class=\"active\"><a href=\"#\">"+path+"</a></li>\n");
                }
            }
            else {
                accum.append("../");
                html.insert(0, "<li><a href=\""+accum+"\">"+path+"</a></li>\n");
            }
        }
        return html;
    }

    private String makeIndexContent(String current, StringBuffer navigator, StringBuffer directories, StringBuffer items) throws IOException {
        StringBuffer html = new StringBuffer();
        InputStream is = servletContext.getResourceAsStream("/WEB-INF/templates/index.html");
        BufferedReader br = new BufferedReader(new InputStreamReader(is));
        String line;
        while ((line = br.readLine()) != null) {
            html.append(line+"\n");
        }

        String token = "{CURRENT}";
        int start = html.indexOf(token);
        current = current.substring(0, current.length() - 1);
        int lastSlash = current.lastIndexOf('/')+1;
        current = URLDecoder.decode(current.substring(lastSlash), "UTF-8");
        if ("album".equals(current)) {
            current = "";
        }
        html.replace(start, start+token.length(), current);

        token = "{NAVIGATOR}";
        start = html.indexOf(token);
        html.replace(start, start+token.length(), navigator.toString());

        token = "{DIRECTORIES}";
        start = html.indexOf(token);
        html.replace(start, start+token.length(), directories.toString());

        token = "{IMAGES}";
        start = html.indexOf(token);
        html.replace(start, start+token.length(), items.toString());
        return html.toString();
    }

    private String getProxyTarget() {
        String target = proxyTarget;
        if (target.length() == 0) {
            target = aeon;
        }
        return target;
    }

}
