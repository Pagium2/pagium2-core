<div class="mint-tabbar is-fixed">
  <% items.forEach(function (item) {%>
  <% if (item.selected == "true") {%>
      <div data-id="<%= item.id%>" class="mint-tab-item is-selected">
          <div class="mint-tab-item-icon">
            <img src="<%= item.img%>">
            <div class="mint-tab-item-label"><%= item.title%></div>
          </div>
         </div>
        <% } else{ %>
        <div data-id="<%= item.id%>" class="mint-tab-item ">
          <div class="mint-tab-item-icon">
            <img src="<%= item.img%>">
            <div class="mint-tab-item-label"><%= item.title%></div>
          </div>
         </div>
        <% } %>
    <% }) %>
</div>