<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%
boolean compiled = !"localhost".equals(request.getServerName());
compiled = compiled || "true".equals(request.getParameter("compiled"));
String prefix = request.getServerName().matches("aeon|byeight") ? "/" : "http://www.byeight.com/";

%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <meta name="viewport" content="width=device-width, initial-scale=0.5" />
    <title>Nguyen Family Album - <%= request.getLocalName() %></title>
    <link rel="stylesheet" href="/byeight/css/album.css?compiled=<%=compiled%>"/>
    <script type="text/javascript">
    var urlPrefix = "<%=prefix%>";
    </script>
</head>

<body>

<% if (compiled) { %>
    <script type="text/javascript" src="js/by8-core.js?compiled=true&m=js/album/init.js"></script>
<% } else { %>
    <script type="text/javascript" src="js/by8-core.js"></script>
    <script type="text/javascript" src="js/album/init.js"></script>
<% } %>

<div id="body"></div>

</body>
</html>