<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<% boolean compiled = !"localhost".equals(request.getServerName()); %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Nguyen Family Album - <%= request.getLocalName() %></title>
<% if (compiled) { %>
    <link rel="stylesheet" href="/byeight/compiled/css/album.css"/>
<% } else {%>
    <link rel="stylesheet" href="/byeight/css/album.css"/>
<% } %>
</head>

<body>

<% if (compiled) { %>
    <script type="text/javascript" src="compiled/js/by8-core.js?m=js/album/init.js"></script>
<% } else { %>
    <script type="text/javascript" src="js/by8-core.js"></script>
    <script type="text/javascript" src="js/album/init.js"></script>
<% } %>

<div id="header">
<span class="surname"><span class="f">N</span>guyen</span> Family Album
</div>

<div id="body"></div>

</body>
</html>