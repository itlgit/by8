package com.byeight.tags;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Servlet implementation class TagServlet
 */
public class TagServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Gson gson;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public TagServlet() {
        super();
        gson = new GsonBuilder().create();
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
	    response.setContentType("application/json");
	    List<Tag> tags = getTags(query);
	    response.getWriter().write(gson.toJson(tags));
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
	    tags.add(new Tag("/", "tag", query));
	    return tags;
	}

}
