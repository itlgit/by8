package com.byeight.tags;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.byeight.manifest.bo.Item;
import com.byeight.manifest.bo.Manifest;
import com.byeight.proxy.Configuration;
import com.byeight.proxy.ManifestProxy;
import com.byeight.template.IndexGenerator;

/**
 * Servlet implementation class TagServlet
 */
public class TagServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@Override
	public void init(ServletConfig config) throws ServletException {
	    super.init(config);
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	@Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    String contextPath = request.getContextPath();
	    String referer = request.getHeader("referer");
	    String query = request.getParameter("query");

	    /*
	     * If no query given, use path from the Referer
	     */
	    if (query == null && referer != null) {
	        int start = referer.indexOf(contextPath);
	        query = referer.substring(start);
	    }

	    List<Tag> tags = getTags(query);
	    ArrayList<Item> items = new ArrayList<>(tags.size());
	    for (Tag tag : tags) {
	        Item item = buildItem(tag);
	        items.add(item);
	    }

	    Manifest manifest = new Manifest("", new ArrayList<String>(0), items);
	    IndexGenerator ig = new IndexGenerator(getServletContext(), getProxyTarget(request));
	    response.setContentType("text/html; charset=UTF-8");
	    response.getWriter().write(ig.makeIndexContent(request.getRequestURI(), manifest));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	@Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    String query = request.getParameter("query");
	}

	private List<Tag> getTags(String query) {
	    ArrayList<Tag> tags = new ArrayList<>();
	    tags.add(new Tag("Media/Dad's Pictures/IMG_0084.JPG", Item.IMAGE_TYPE, "helmet"));
	    tags.add(new Tag("Media/House/IMG_2800.JPG", Item.IMAGE_TYPE, "house"));
	    return tags;
	}

	private Item buildItem(Tag tag) {
	    String path = tag.getPath();
	    String comparePath = "thumbs/"+path;
	    String dir = getDirectoryFromPath(path);
	    Manifest manifest = ManifestProxy.get(dir);
	    List<Item> items = manifest.getItems();
	    String thumb = "";
	    int width = 133, height = 100;
	    for (Item item : items) {
	        if (comparePath.equals(item.getUrl())) {
	            thumb = item.getThumb();
	            width = item.getWidth();
	            height = item.getHeight();
	        }
	    }
	    Item item = new Item(path, thumb, width, height);
	    return item;
	}

	private String getDirectoryFromPath(String path) {
	    String dir = "";
	    String[] parts = path.split("/");
        try {
            for (int i=0,len=parts.length; i<len-1; i++) {
                dir += URLEncoder.encode(parts[i], "UTF-8").replaceAll("\\+", "%20") + (i<len-1 ? "/" : "");
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
	    return dir;
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
