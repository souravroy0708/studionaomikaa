// Studio Naomikaa — shared site behaviour
(function(){
  "use strict";

  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Sticky nav shadow on scroll */
  var nav = document.querySelector(".site-nav");
  if(nav){
    var onScroll = function(){
      if(window.scrollY > 8){ nav.classList.add("is-scrolled"); }
      else{ nav.classList.remove("is-scrolled"); }
    };
    document.addEventListener("scroll", onScroll, {passive:true});
    onScroll();
  }

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if(toggle && links){
    toggle.addEventListener("click", function(){
      var open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded","false");
      });
    });
  }

  /* Portfolio filter */
  var filterBar = document.querySelector(".filter-bar");
  if(filterBar){
    var buttons = filterBar.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll(".p-card");
    buttons.forEach(function(btn){
      btn.addEventListener("click", function(){
        buttons.forEach(function(b){
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        var f = btn.getAttribute("data-filter");
        cards.forEach(function(card){
          var show = f === "all" || card.getAttribute("data-cat") === f;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* Testimonial carousel (single quote rotator, with prev/next arrows) */
  var testiWrap = document.querySelector("[data-testi-carousel]");
  if(testiWrap){
    var slides = testiWrap.querySelectorAll(".testi-slide");
    var dotsWrap = testiWrap.querySelector(".testi-dots");
    var current = 0;
    var dots = [];
    var timer = null;
    var paused = false;
    var arrowSVG = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 6l6 6-6 6\"/></svg>";

    if(dotsWrap){
      slides.forEach(function(_, i){
        var d = document.createElement("button");
        d.setAttribute("aria-label", "Show testimonial " + (i+1));
        d.setAttribute("aria-current", i === 0 ? "true" : "false");
        if(i === 0) d.classList.add("is-active");
        d.addEventListener("click", function(){ show(i); restart(); });
        dotsWrap.appendChild(d);
        dots.push(d);
      });

      if(slides.length > 1){
        var navRow = document.createElement("div");
        navRow.className = "testi-nav-row";
        var prevBtn = document.createElement("button");
        prevBtn.className = "testi-arrow testi-prev";
        prevBtn.setAttribute("aria-label", "Previous testimonial");
        prevBtn.innerHTML = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 6l-6 6 6 6\"/></svg>";
        var nextBtn = document.createElement("button");
        nextBtn.className = "testi-arrow testi-next";
        nextBtn.setAttribute("aria-label", "Next testimonial");
        nextBtn.innerHTML = arrowSVG;

        dotsWrap.parentNode.insertBefore(navRow, dotsWrap);
        navRow.appendChild(prevBtn);
        navRow.appendChild(dotsWrap);
        navRow.appendChild(nextBtn);

        prevBtn.addEventListener("click", function(){ show((current - 1 + slides.length) % slides.length); restart(); });
        nextBtn.addEventListener("click", function(){ show((current + 1) % slides.length); restart(); });
      }
    }

    function show(i){
      slides[current].style.display = "none";
      if(dots[current]){ dots[current].classList.remove("is-active"); dots[current].setAttribute("aria-current","false"); }
      current = i;
      slides[current].style.display = "";
      if(dots[current]){ dots[current].classList.add("is-active"); dots[current].setAttribute("aria-current","true"); }
    }
    function restart(){
      if(timer) clearInterval(timer);
      timer = null;
      // Respect prefers-reduced-motion: no forced auto-advance for users who asked for less motion.
      if(slides.length > 1 && !prefersReducedMotion && !paused){
        timer = setInterval(function(){ show((current + 1) % slides.length); }, 5500);
      }
    }
    // Pause on hover/focus so an auto-advancing carousel never yanks focus or reading position (WCAG 2.2.2).
    testiWrap.addEventListener("mouseenter", function(){ paused = true; restart(); });
    testiWrap.addEventListener("mouseleave", function(){ paused = false; restart(); });
    testiWrap.addEventListener("focusin", function(){ paused = true; restart(); });
    testiWrap.addEventListener("focusout", function(){ paused = false; restart(); });

    slides.forEach(function(s, i){ if(i !== 0) s.style.display = "none"; });
    restart();
  }

  /* FAQ accordion */
  document.querySelectorAll(".faq-q").forEach(function(q){
    q.addEventListener("click", function(){
      var item = q.closest(".faq-item");
      var wasOpen = item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".faq-item").forEach(function(i){
        i.classList.remove("is-open");
        var btn = i.querySelector(".faq-q");
        if(btn) btn.setAttribute("aria-expanded", "false");
      });
      if(!wasOpen){
        item.classList.add("is-open");
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* Simple contact form UX (static demo — no backend wired up) */
  var form = document.querySelector("[data-contact-form]");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var note = form.querySelector("[data-form-note]");
      if(note){
        note.textContent = "Thanks — your message is ready to send. Connect this form to your email or CRM to go live.";
        note.style.display = "block";
      }
      form.reset();
    });
  }
})();
