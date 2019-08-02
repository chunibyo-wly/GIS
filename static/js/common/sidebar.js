let resulet_sidebar = get_user();
$('.sidebar-menu .name-caret').text(resulet_sidebar.name);
$('.sidebar-menu p').text(resulet_sidebar.role.split('_')[1]);