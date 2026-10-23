/* Shared chrome injected synchronously so there is no flash before the curtain. */
(function () {
  const NAV = `
  <header class="nav ${document.body.dataset.nav || ''}">
    <a class="brand" href="index.html" aria-label="Sovereign home">
      <span class="mark logo-mask"></span>
      <span class="wordmark logo-mask"></span>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <a href="collection.html?for=women">Women</a>
      <a href="collection.html?for=men">Men</a>
      <a href="product.html?style=regent-blazer">Customise</a>
      <a href="story.html">Our story</a>
    </nav>
    <div class="nav-right">
      <a href="story.html#fitting" class="hide-m">Book a fitting</a>
      <a href="#" onclick="return false" aria-label="Bag">Bag<span class="bag-count">0</span></a>
    </div>
  </header>`;
  const FOOTER = `
  <footer class="footer">
    <div class="wrap">
      <div class="big-wordmark wordmark logo-mask rv"></div>
      <div class="footer-grid">
        <div>
          <h4>Be first to the fitting room</h4>
          <p class="muted" style="max-width:380px;font-size:14px">The first collection opens by appointment. Leave your address and we'll write once, when the doors open.</p>
          <form class="newsletter" onsubmit="event.preventDefault(); this.querySelector('button').textContent='Noted';">
            <input type="email" placeholder="Your email address" aria-label="Email address" required>
            <button type="submit">Notify me</button>
          </form>
        </div>
        <div><h4>Collection</h4><ul>
          <li><a href="collection.html?for=women">Women</a></li>
          <li><a href="collection.html?for=men">Men</a></li>
          <li><a href="product.html?style=regent-suit">Three-piece suits</a></li>
          <li><a href="product.html?style=regent-blazer">Customise a style</a></li>
        </ul></div>
        <div><h4>House</h4><ul>
          <li><a href="story.html">Our story</a></li>
          <li><a href="story.html#craft">Craftsmanship</a></li>
          <li><a href="story.html#fitting">Fittings</a></li>
          <li><a href="story.html#stitch">The cross stitch</a></li>
        </ul></div>
        <div><h4>Care</h4><ul>
          <li><a href="#">Made to measure guide</a></li>
          <li><a href="#">Delivery and returns</a></li>
          <li><a href="#">Garment care</a></li>
          <li><a href="#">Contact</a></li>
        </ul></div>
      </div>
      <div class="footer-base">
        <span>© Sovereign. Formal tailoring for women and men.</span>
        <span>Demo build · photography to follow</span>
      </div>
    </div>
  </footer>`;
  const s = document.currentScript;
  s.insertAdjacentHTML('afterend', NAV);
  document.addEventListener('DOMContentLoaded', () => {
    const slot = document.getElementById('footer-slot');
    if (slot) slot.outerHTML = FOOTER;
  });
})();
