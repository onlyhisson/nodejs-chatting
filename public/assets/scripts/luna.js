/**
 * LUNA - Responsive Admin Theme
 *
 */

$(document).ready(function () {
    // 선택한 메뉴 active 적용
    // 메뉴 추가시
    // /views/partials/left.ejs 에서 메뉴의 class 명과 해당 페이지의 url path를 맞춰줘야 한다.
    const pagePath1 = window.location.pathname.split('/')[1];
    const pagePath2 = window.location.pathname.split('/')[2];

    console.log(pagePath1);
    console.log(pagePath2);

    $('.luna-nav').find('li').removeClass('active');    // 서브메뉴 모든 li태그의 active 제거
    $(`.menu-${pagePath1}`).addClass('active');
    $(`.menu-${pagePath1} a`).attr('aria-expanded', 'true');
    $(`.menu-${pagePath1} a`).removeClass('collapsed');
    $(`#${pagePath1}Menu`).addClass('show');
    $(`.menu-item-${pagePath2}`).addClass('active');

    // Handle minimalize left menu, 서브 메뉴 보이기/숨기기
    $('.left-nav-toggle a').on('click', function(event){
        event.preventDefault();
        $("body").toggleClass("nav-toggle");
    });

    // Hide all open sub nav menu list, 서브 메뉴의 하위 메뉴 출력시 호출
    $('.nav-second').on('show.bs.collapse', function () {
        $('.nav-second.in').collapse('hide');
    });

    // Handle panel toggle, 내부 content 보이기/숨기기
    $('.panel-toggle').on('click', function(event){
        event.preventDefault();
        var hpanel = $(event.target).closest('div.panel');
        var icon = $(event.target).closest('i');
        var body = hpanel.find('div.panel-body');
        var footer = hpanel.find('div.panel-footer');
        body.slideToggle(300);
        footer.slideToggle(200);

        // Toggle icon from up to down
        icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        hpanel.toggleClass('').toggleClass('panel-collapse');
        setTimeout(function () {
            hpanel.resize();
            hpanel.find('[id^=map-]').resize();
        }, 50);
    });

    // Handle panel close, 내부 content 닫기
    $('.panel-close').on('click', function(event){
        event.preventDefault();
        var hpanel = $(event.target).closest('div.panel');
        hpanel.remove();
    });
});