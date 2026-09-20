(function(){
  function init(){
    document.querySelectorAll('.site-nav').forEach(function(nav){
      var btn = nav.querySelector('.nav-menu-btn');
      if (!btn) return;
      function set(open){
        nav.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        set(!nav.classList.contains('open'));
      });
      nav.addEventListener('click', function(e){
        if (e.target.closest && e.target.closest('.nav-extras .status-chip, .nav-extras a')) set(false);
      });
      document.addEventListener('click', function(e){
        if (nav.classList.contains('open') && !nav.contains(e.target)) set(false);
      });
      document.addEventListener('keydown', function(e){
        if (e.key === 'Escape') set(false);
      });
      var mq = window.matchMedia('(min-width:641px)');
      (mq.addEventListener ? mq.addEventListener.bind(mq,'change') : mq.addListener.bind(mq))(function(){ set(false); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
