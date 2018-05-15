<section class="wap_item_wrap">
    <ul class="icon-grid-ul ">
    <% items.forEach(function (item) {%>
       <li class="icon-wrapper">
            <a href="<%= item.href %>">
                <img src="<%= item.img %>" alt="<%= item.title %>">
                <p><%= item.title %></p>
            </a> 
        </li>
    <% }) %>
    </ul>
</section>