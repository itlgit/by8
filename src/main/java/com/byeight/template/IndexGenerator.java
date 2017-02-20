package com.byeight.template;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;

import javax.servlet.ServletContext;

import com.byeight.manifest.bo.Item;
import com.byeight.manifest.bo.Manifest;

public class IndexGenerator {
    private ServletContext servletContext;
    private String proxyTarget;

    public IndexGenerator(ServletContext servletContext, String proxyTarget) {
        this.servletContext = servletContext;
        this.proxyTarget = proxyTarget;
    }

    public String makeIndexContent(String requestURI, Manifest manifest) throws IOException {
        String nav = getNavigatorHtml(requestURI);
        String dirs = getDirectoryHtml(manifest.getDirectories());
        String imgs = getItemsHtml(manifest.getItems());
        return makeIndexContent(requestURI, nav, dirs, imgs);
    }

    public String makeIndexContent(String requestURI, String navigator, String directories, String items) throws IOException {
        StringBuffer html = new StringBuffer();
        InputStream is = servletContext.getResourceAsStream("/WEB-INF/templates/index.html");
        BufferedReader br = new BufferedReader(new InputStreamReader(is));
        String line;
        while ((line = br.readLine()) != null) {
            html.append(line+"\n");
        }

        String token = "{CURRENT}";
        int start = html.indexOf(token);

        String current = getNameFromPath(requestURI);
        current = URLDecoder.decode(current, "UTF-8");
        if ("album".equals(current)) {
            current = "";
        }
        html.replace(start, start+token.length(), current);

        token = "{NAVIGATOR}";
        start = html.indexOf(token);
        html.replace(start, start+token.length(), navigator);

        token = "{DIRECTORIES}";
        start = html.indexOf(token);
        html.replace(start, start+token.length(), directories);

        token = "{IMAGES}";
        start = html.indexOf(token);
        html.replace(start, start+token.length(), items);
        return html.toString();
    }

    private String getDirectoryHtml(List<String> items) {
        StringBuffer buffer = new StringBuffer();
        for (int i=0,len=items.size(); i<len; i++) {
            String item = items.get(i);
            String link = makeDirectoryLink(item);
            String sep = " |";
            if (i == len - 1) {
                sep = "";
            }
            buffer.append(link+sep+"\n");
        }
        return buffer.toString();
    }

    private String makeDirectoryLink(String item) {
        int lastSlash = item.lastIndexOf('/');
        String basename = item.substring(lastSlash+1);
//        return "<a href=\""+basename+"/\">"+basename+"</a>";
        String fullUrl = "/album/"+item;
        return "<a href=\""+fullUrl+"/\">"+basename+"</a>";
    }

    private String getItemsHtml(List<Item> items) {
        StringBuffer buffer = new StringBuffer();
        for (int i=0,len=items.size(); i<len; i++) {
            Item image = items.get(i);
            String link = makeLink(image);
            buffer.append(link+"\n");
        }
        return buffer.toString();
    }

    private String makeLink(Item item) {
        String file = item.getUrl();
        String fileName = getNameFromPath(file);
        String type = item.getType();
        String thumb = item.getThumb();

        int width = item.getWidth();
        int height = item.getHeight();
        String fullUrl = "/"+file;
        String fullThumb = "/"+thumb;
        if (proxyTarget.length() > 0) {
            fullUrl = proxyTarget+file;
            fullThumb = proxyTarget+thumb;
        }
        return  "<a class=\"thumbnail-link\" title=\""+fileName+"\" data-thumbnail=\""+thumb+"\" data-type=\""+type+"\" href=\""+fullUrl+"\">"+
                "<img class=\"thumbnail\" src=\""+fullThumb+"\" width=\""+width+"\" height=\""+height+"\">"+
                (type == Item.VIDEO_TYPE ? "<i class=\"fa fa-play fa-lg\"></i>" : "")+
                "</a>";
    }

    private String getNavigatorHtml(String requestURI) {
        StringBuffer html = new StringBuffer();
        String[] paths = requestURI.split("\\/");
        StringBuffer accum = new StringBuffer();

        for (int len=paths.length,i=len-1; i>1; i--) {
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
        return html.toString();
    }

    private String getNameFromPath(String path) {
        String name = "";
        String[] parts = path.split("\\/");
        if (parts.length > 0) {
            name = parts[parts.length-1];
        }
        return name;
    }
}
