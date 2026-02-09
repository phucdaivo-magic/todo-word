import YouTubePlayer from "youtube-player";
new EventSource("/esbuild").addEventListener("change", () => location.reload());
class Slider {
  constructor($element) {
    this.$element = $element;
    this.index = 0;
    this.distance = 0;
    this.isNavigating = false;
    this.limitKeepCurrent = 50;
    this.draggingOver = true;
    this.rows = this.dataset('rows', 1);
    this.gap = this.dataset('gap', 0);
    Object.entries(this.$element.dataset).forEach(([key, value]) => {
      if (isNaN(value)) {
        this[key] = value;
      } else {
        this[key] = JSON.parse(value);

      }
    });

    this.init();

    this.shouldAddActions(() => {
      this.updateIsNavigating();
      this.addPagination();
      this.addNavigation();
      this.addTouchEvents();
      this.addMouseDrag();
      this.addKeyboardEvents();
    });
  }

  dataset(key, initData) {
    return this.$element.dataset[key] || initData;
  }

  shouldAddActions(callback) {
    if (this.itemList.length > this.rows) {
      callback();
    }
  }

  loadImagesSuccess() {
    return Promise.all(Array.from(this.$element.querySelectorAll('img')).map(($img) => {
      return new Promise((resolve) => {
        if ($img.complete) {
          resolve($img);
        }
        $img.onload = () => {
          resolve($img);
        }
      });
    }));
  }

  init() {
    this.$element.style.display = `flex`;
    this.$element.style.flexDirection = `row`;
    this.$element.style.gap = this.gap + 'px';
    this.$element.style.flexWrap = `nowrap`;
    this.$element.style.overflow = `hidden`;
    this.$element.style.position = `relative`;
    this.itemList = this.$element.querySelectorAll(':scope > div');
    this.itemList.forEach(($item) => {
      const calc = `calc((100% - ${(this.rows - 1) * this.gap}px) / ${this.rows})`;
      $item.style.width = calc;
      $item.style.maxWidth = calc;
      $item.style.minWidth = calc;
      $item.style.position = `relative`;
      $item.style.touchAction = `pan-y`;

    });
  }

  updateIsNavigating() {
    this.$element.addEventListener('click', () => {
      this.isNavigating = true;
    });

    document.addEventListener('click', (e) => {
      if (this.$element.contains(e.target)) {
        return;
      }
      this.isNavigating = false;
    });
  }

  addMouseDrag() {
    this.$element.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.startX = e.clientX;

    });

    this.$element.addEventListener('mousemove', (e) => {
      if (this.startX) {
        this.endX = e.clientX;
        this.distance = this.endX - this.startX;
        this.updateView();
      }
    });

    const mouseUpHandler = (e) => {
      e.preventDefault();
      this.endX = e.clientX;
      let step = this.distance / (this.$element.offsetWidth / this.rows);

      if (step < 0) {
        step = Math.floor(step);
      } else {
        step = Math.ceil(step);
      }

      this.startX = null;
      if (this.distance > this.limitKeepCurrent) {
        this.index = this.index - step;
        this.distance = 0;
        this.updateView();
      } else if (this.distance < -this.limitKeepCurrent) {
        this.index = this.index - step;
        this.distance = 0;
        this.updateView();
      }
      this.distance = 0;
      this.updateView();
    }

    this.$element.addEventListener('mouseup', mouseUpHandler);
    this.$element.addEventListener('mouseleave', mouseUpHandler);
  }

  addTouchEvents() {
    document.addEventListener('scroll', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, { passive: false });
    this.$element.addEventListener('touchstart', (e) => {
      this.startX = e.touches[0].clientX;
    });
    this.$element.addEventListener('touchmove', (e) => {
      if (this.startX) {
        this.endX = e.touches[0].clientX;
        this.distance = this.endX - this.startX;
        this.updateView();
      }
    });
    this.$element.addEventListener('touchend', (e) => {
      this.endX = e.changedTouches[0].clientX;
      this.deltaX = this.endX - this.startX;
      this.startX = null;
      let step = this.distance / (this.$element.offsetWidth / this.rows);

      if (step < 0) {
        step = Math.floor(step);
      } else {
        step = Math.ceil(step);
      }
      if (this.distance > this.limitKeepCurrent) {
        this.index = this.index - step;
        this.distance = 0;
        this.updateView();
      } else if (this.distance < -this.limitKeepCurrent) {
        this.index = this.index - step;
        this.distance = 0;
        this.updateView();
      }
      this.distance = 0;
      this.updateView();

    });
  }

  throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }


  addNavigation() {
    const navigation = document.createElement('div');
    navigation.classList.add('slider-navigation');

    const nextButton = document.createElement('button');
    navigation.appendChild(nextButton);
    nextButton.classList.add('slider-navigation-button', 'slider-navigation-button-next');

    // Events
    nextButton.addEventListener('click', this.throttle((event) => {
      event.preventDefault();
      event.stopPropagation();
      if (this.index > this.itemList.length - this.rows - 1) {
        this.index = 0;
      } else {
        this.index++;
      }
      this.updateView(true);
    }, 600));

    const prevButton = document.createElement('button');
    navigation.appendChild(prevButton);
    prevButton.classList.add('slider-navigation-button', 'slider-navigation-button-prev');
    // Events
    prevButton.addEventListener('click', this.throttle((event) => {
      event.preventDefault();
      event.stopPropagation();
      // this.index = Math.max(0, this.index - 1);
      if (this.index < 1) {
        this.index = this.itemList.length - this.rows;
      } else {
        this.index--;
      }

      this.updateView(true);
    }, 600));

    this.$element.appendChild(navigation);
  }

  addKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
      if (this.isNavigating === false) return;
      if (e.key === 'ArrowRight') {
        this.index++;
      } else if (e.key === 'ArrowLeft') {
        this.index--;
      }
      this.updateView(true);
    });
  }

  updateView(isNavigating = false) {
    this.index = Math.max(0, this.index);
    this.index = Math.min(this.index, this.itemList.length - this.rows);
    let distance = this.distance;
    this.itemList.forEach(($item, index) => {
      if (this.distance !== 0) {
        $item.style.transition = 'none';
        const updateDistance = () => {
          if (this.draggingOver) {
            distance = this.distance / 6;
          } else {
            distance = 0;
          }
        }
        if (this.index === 0 && this.distance > 0) {
          updateDistance();
        }

        if (this.index === this.itemList.length - this.rows && this.distance < 0) {
          updateDistance();
        }
      } else {
        if (isNavigating) {
          $item.style.transition = 'transform 0.8s cubic-bezier(0.42, 0, 0.58, 1)';
        } else {
          $item.style.transition = 'transform 0.25s cubic-bezier(0.42, 0, 0.58, 1)';
        }

      }
      $item.style.transform = `translate3d(calc(${(-this.index) * 100}% + ${distance}px - ${(this.gap * this.index)}px), 0, 0)`;
    });

    this.paginationItems.forEach(($item, index) => {
      $item?.classList?.toggle('slider-pagination-item-active', index === this.index);
    });
  }

  addPagination() {
    const pagination = document.createElement('div');
    pagination.classList.add('slider-pagination');

    const paginationContent = document.createElement('div');
    paginationContent.classList.add('slider-pagination-content');


    this.paginationItems = Array.from(this.itemList).map(($item, index) => {
      if (index > this.itemList.length - this.rows) return;
      const paginationItem = document.createElement('div');
      paginationItem.classList.add('slider-pagination-item');
      paginationItem.classList.toggle('slider-pagination-item-active', index === this.index);

      paginationItem.addEventListener('click', () => {
        this.index = index;
        this.updateView(true);
      });

      paginationContent.appendChild(paginationItem);
      return paginationItem;
    });


    pagination.appendChild(paginationContent);

    this.$element.appendChild(pagination);
  }

}

const SLIDER_HERO = [
  {
    background: '#cad1d5',
    image: 'https://media.vw.mediaservice.avp.tech/media/fast/v3_x2SW4gbZRiGf591XWtzYGayGdmmSRqbsU0y2WSSpo0apYer6upKZaUKDZPkz6HNJHEyybZ7IRWPFERQu4KoCEKrtbSK7IVQrOKFhxtFQVYRD4iIoELxQpGKpoUP3u-F7335Lp6zv4vpkSt4cM_ZP_W_r7v-vh8Q4uhAiKkFMe2N3Fr_GiHEIjd0HLsl5w8PZEuPjJdNezyYt72uPZy3clbJvLqa9frYCoqZSUBMCTFzfCLvXzEiEBi53YHt2k62IWujlrKtXi7mys2d-Z3FulWs1XcV7YKVb5Rq9ZrVlLJpNwrlYr68w1In6TNiajS0RbBRcvpN2yo03X7PG9TFTN1pFAYrOXHtlR9EcKvndlot6VYdt9oe5NlmsPU3ItuJLBDzE1untEL8IvGfSKgk2xiPY7yI8RbGGqnNpO4gtUjqDKkLpA9ifkc2RLZMUKJ8inocrYX2MKEDRB22rJM5hHkJsRkh8Y0Iv44-jR5m02TOE3-SxM0kLNI9zBG-7QS-RjmB-gDhu9BPoH_IpteIrhJ7hNgfxGNk7iZzAf95AscInkTPoR8icgvKjyjfoqZQfyb0DrP_EN5AuED4VsIvEH4TvYB-D3offZW5y8S-IdEjeZDkyyTPkXyX5EcY95LaRTpD-nMyL5F5g8xXiFMEH0V5GzWEtgPtPbS_mD1M_FUST5P4DO0xogNu_IW5i8x9SSRKZIloiKiHEce4jZSJKTA3Yq4inmPjv_iex_cBvv_wH8G_jv8SwadQVlBeQTmFchn1dtT9qEdRn0VdQ_sC7RNCvxJbY8sBEuvctIHkfpLfY2RJ3UlYI3aaRJR0GTNL4BkC59DShJ5g9mPCy0T8RIYTUE7K3rgzgcORPa-ydH91794lq7qn320Yy52G167ky1bOaMtOq-1VyqWcYXcHbbviuSNp1G1HunZl99Kita-6u2pVcznLsHsT6r1OvzesGE6_IbuuHHeGE19ZWMwbrW6_Zndde_mIPDaUD41kry4rluFIz27Ynj2W7tVTS5uatP4PY3gVQmgDAAA.webp?width=864',
    title: 'The 2026 Atlas Cross Sport Crossover SUV',
    description: 'See each Atlas Cross Sport side by side and compare trims to build your perfect match. Want to get started? Select a trim below.',
  },
  {
    background: '#103369',
    image: 'https://media.vw.mediaservice.avp.tech/media/fast/v3_02SX2hbdRTHf_vUrc62Ccltb9waszT2XkeS2-berEkzTaHdZJs6qbVUnGK8zf01iUtu4s1Nah-UiX8efBEdThyuT-KYDMEHEXGICk6mbwrSF9lg-iSCQwc-7MHbPe3p8Dnne875Pnwv_iV29jzBMwsX_4n9t-vu5WsI8VJHiIFFsdPveavtHUKIRe5ptOyanH6hI2ux8f66Yfc70w1n2spZBaPhHDBM86RRrfatsBgM9GJAiMFTQflmG0Qo1POaHduzW1OOXO3VIvvzdilnm85aLi-LzuxaIWeWivlSzskX886Mk3eKVtFxCgdmosH2phjodW0Rdgqt9ppt5de8tut3qmJQzpp5zzXFXdsuRHjS9xq1mvQqLa9S75joP6JNML6D8SvEM8QPEz9C4l-SGsnvSF4ndRWtjv4G-ln0L0jvJ71EWpL-hPQlMk9jfMVUlKk5wpLwBpHvUWoorzC6TKLFxBbaNbIVstcxbiDuQ8wh6qgfEhsj-RqpB0hZZFyMHpG3iJ5g7BfUh4ltEPuB8YPse5XkHjKfkX2W7LeMnCcUjJ4jdoL4QSJ_oO5GnUGdRX2fWJvYGfbeIuWS-hvNRnsP7Rzal-hPkJ4l7ZKBjErmV7Jvk71A9jcUC-Vrxh4k-RHK6yRckjeZGOZe2HOKvZeJJ4gvEb9M4hH0h0gbGALjDOI04hxDNxneZDjw9jwjPzNyg9AHhN8l8jKRTSIfE7lFdI7oO0QvEL1E9CcKMyhbKFcY_ZN9nzPxJKkt7t-NtoR2FX2K9KOoCrEhUglCpwl9SnQJJcPom6jrqL8TDxHviqHJ-eMLxx47duTosnknWHdCXuyafLxRq_tBTs5Kt98IstGSrl9eeapy6NCKVVloNx19veH49bJZsnJ6XW6ry6VCTrebnbpd9r2e1Kt2S3p2eX5l0Tpcma9YlVzO0m03yLzfaLvd8u0XeqvtyKYn-41u0CwfXzT1WrO9ajc9e_2k3OjKF3vSrcqypbekbzu2b_eld1tqKQPB6f8B94AGb2sDAAA.webp?width=864',
    title: 'Golf R. Golf R',
    description: 'Golf R with 4MOTION® 2.0 TSI 7-speed DSG® automatic transmission with Tiptronic® and Sport mode',
  },
  {
    background: '#fff',
    image: 'https://assets.volkswagen.com/is/image/volkswagenag/VW_NGW6_Models_ID-Buzz_v2?Zml0PWNyb3AsMSZmbXQ9d2VicC1hbHBoYSZxbHQ9Nzkmd2lkPTUwMCZiZmM9b2ZmJjkzMDk=',
    title: 'Jetta GLI. Autobahn',
    description: 'Autobahn 2.0L Turbo 6-speed manual transmission',
  },
  {
    background: '#d8e0e4',
    image: 'https://media.vw.mediaservice.avp.tech/media/fast/v3_02TbWhbdRTG__662tU2CffeNlfbmGSxuZtJbpvcdI1dDdJW1M1VqysVFBpvkpuXmjdvb1JFlKEDX1A3EIYMFT_ZTkuZiiKKm1PZGEwm25dNBhP31SFuiCKKpvu0T-f8Duc5PB-es3ZFdDZtwRNTa9fUv27ePPczQjzTEKLjmOh0mna2fpMQYpZbylWzaI0sNqyiGmwt62arMbJoOY45YsSNMf16qydSk3ou1zI8oqstEh1CdO1tl282QLjdTbvSMG2zOpy3ss2itC2RLIyaKWPUsFLJQqKQzVoJa3R7Pp8cGx8tFHIpM58cTeVSKbmt_k50NJdM4cmPVesF00gW7HrNaeREV7a5fbxlxMWmDR_CM-TY5WLRsjNVO1NqJNj2G0NJBs_g0_HNEBgicB-B8wQnCH5L8DIhmdA5wiW0V9AOoR1B-4zI7UTuITJL5EMix4k-if4T-n8MpxBzuLbisZBOIL-IUkR5AeUafXvwV_CvsOU8-lWEjKjQ28K7iroZ1ctgH4NrBF8mtJWQQbRJbBOxRWJ_oDv03on7AtJryI_j3Y36JuoXDLatvkSwn8jnRN8meoToZWJJYjuIHcd1GDWOuoBvB9IPSJeQLiLr9P-NtxtvEu8E3o9Qk6gPo9ZR32LgVwb-IWAS-IVQjdDHhBcIHyD8LuF1wl8TPon2CJG7iP5IbC-xw8TOIFbw7EM6ityJchTlT_pXCb5P6FVCJ1H24a_jP8GtcNs0A8cYOIfPj-9RfBfx78K_jOZDmyCiowv0HvT99PxL70F6v8IlcHXj-gDXaVy_4z6L53U8byA9j_Qe0joyyHcjN5EPIq8hf4p8CmUV5SzKKfqu4hMEvmTLHkIXuKOb8C7C7xC-hDZM5EFiV_AqeE8TWCH4CSE_-jDu_bjXkRZQovQ9R__3eJfxufAtiZ6hyZmpnbt33v_AXOJGMG6EZDuRh6xaq9xOYdWqOen5xzLT0_NGZqpeyWvL5bxTSifGjbhWssrFkpMeH4trZqVRMtOO3bS0nFm1bDM9OT9r3JuZzBiZeNzQzFr7xZxyvbaUfmhDpFXreatiW63yUnuYnplNaMVKPWtWbHP5KevZJevpplXLWWlDq1qOmTcds2XZ11cNpaN9-n9bKZBA2gMAAA.webp?width=864',
    title: 'Pro S',
    description: 'MacPherson strut-type with lower control arm, coil springs, telescopic dampers, anti-roll bar',
  },
  {
    background: '#fff',
    image: 'https://assets.volkswagen.com/is/image/volkswagenag/Polo_1920x1080-5?Zml0PWNyb3AlMkMxJndpZD0xOTIwJmhlaT0xMDgwJmZtdD1wbmctYWxwaGEmYmZjPW9mZiY1M2Qx',
    title: 'The Polo',
    description: 'The small car with a big heart.'
  }
];

class SliderHero {
  constructor(element) {
    this.$element = element;

    this.init();
    this.registerEvent();
  }

  init() {
    this.listIds = SLIDER_HERO.map((_, index) => index);
    this.index = 0;
    this.updateView();
  }

  next() {
    this.index = this.getNextIndex(this.index);
    this.updateView();
  }

  prev() {
    this.index = this.getPrevIndex(this.index);
    this.updateView();
  }

  getNextIndex(index) {
    return this.listIds.includes(index + 1) ? index + 1 : 0;
  }

  getPrevIndex(index) {
    return this.listIds.includes(index - 1) ? index - 1 : this.listIds.at(-1);
  }

  updateView() {
    // Update background and image
    const { background, image, title, description } = SLIDER_HERO[this.index];
    this.$element.style.background = background;
    this.$element.querySelector('[data-image]').style.setProperty('opacity', '0');
    this.$element.querySelector('[data-title]').classList.remove('in-view');
    this.$element.querySelector('[data-description]').classList.remove('in-view');
    setTimeout(() => {
      this.$element.querySelector('[data-image]').style.setProperty('transform', 'translateX(100%)');
      this.$element.querySelector('[data-image]').src = image;
      this.$element.querySelector('[data-image]').onload = setTimeout(() => {
        this.$element.querySelector('[data-image]').style.setProperty('transform', 'translateX(0)');
        this.$element.querySelector('[data-image]').style.setProperty('opacity', '1');
        this.$element.querySelector('[data-image]').classList.add('is-animation');

        updateBackground();
      }, 300)
    }, 300);

    // Update navigation
    const updateBackground = () => {
      const nextIndex = this.getNextIndex(this.index);
      const prevIndex = this.getPrevIndex(this.index);

      this.$element.querySelector('[data-navigation-prev] .navigation-item-overlay').style.backgroundColor = SLIDER_HERO[prevIndex].background;
      this.$element.querySelector('[data-navigation-next] .navigation-item-overlay').style.backgroundColor = SLIDER_HERO[nextIndex].background;
      // Update title and description
      this.$element.querySelector('[data-title]').textContent = title;
      this.$element.querySelector('[data-description]').textContent = description;
      this.$element.querySelector('[data-title]').classList.add('in-view');
      this.$element.querySelector('[data-description]').classList.add('in-view');
    }


  }

  registerEvent() {
    this.$element.querySelectorAll('[data-navigation-prev]').forEach(($item) => {
      $item.addEventListener('click', () => {
        this.prev();
      });

      $item.addEventListener('mouseenter', () => {
        this.$element.classList.add('is-left-hover');
      });

      $item.addEventListener('mouseleave', () => {
        this.$element.classList.remove('is-left-hover');
      });
    });

    this.$element.querySelectorAll('[data-navigation-next]').forEach(($item) => {
      $item.addEventListener('click', () => {
        this.next();
      });

      $item.addEventListener('mouseenter', () => {
        this.$element.classList.add('is-right-hover');
      });

      $item.addEventListener('mouseleave', () => {
        this.$element.classList.remove('is-right-hover');
      });
    });
    this.$element.addEventListener('keypress', () => {
      this.next();
    });

    setInterval(() => {
      this.next();
    }, 3000);
  }
}
class VideoPlayer {
  constructor(element) {
    this.$element = element;
    this.ids = element.dataset.ids.split(',');
    this.indexIds = Array.from({ length: this.ids.length }, (_, i) => i);
    this.init();
    this.play(0);
    this.registerEvent();
  }

  play(index) {
    this.player.loadVideoById({
      videoId: this.ids[index],
      startSeconds: 0,
    });
  }

  registerEvent() {
    document.querySelector('[data-next]').addEventListener('click', () => {
      this.next();
    });

    document.querySelector('[data-prev]').addEventListener('click', () => {
      this.prev();
    });

    this.player.on('stateChange', (event) => {
      if (event.data === 0) {
        this.next();
      }
    });

  }

  next() {
    this.index = this.indexIds.includes(this.index + 1) ? this.index + 1 : 0;
    this.player.loadVideoById(this.ids[this.index]);
  }

  prev() {
    this.index = this.indexIds.includes(this.index - 1) ? this.index - 1 : this.indexIds.at(-1);
    this.player.loadVideoById(this.ids[this.index]);
  }

  init() {
    this.player = YouTubePlayer(this.$element, {
      autoplay: 1,
      playerVars: {
        controls: 0,
        title: 0,
        description: 0,
        keywords: 0,
        playlist: this.ids.join(','),
        playsinline: 1,
        rel: 0,
        showinfo: 0,
        enablejsapi: 1,
        widgetid: 1,
        aoriginsup: 1,
        modestbranding: 1,
        rel: 0,
        fs: 0,
        iv_load_policy: 3,
        autoplay: 1,
        mute: 1,
        allow: 'autoplay',
      },
    });
  }
}


class Toogle {
  constructor(element) {
    this.$element = element;
    this.registerEvent();
  }

  registerEvent() {
    const [className, classActive] = this.$element.dataset.toggle.split('|').map(item => item.trim());
    this.$element.addEventListener('click', () => {
      document.querySelectorAll(className).forEach(($tagget) => {
        $tagget.classList.toggle(classActive);
      })
    });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-component="hero-banner"]').forEach(($slider) => {
    new Slider($slider);
  });

  document.querySelectorAll('[data-component="slider-hero"]').forEach(($sliderHero) => {
    new SliderHero($sliderHero);
  });

  document.querySelectorAll('[data-component="video-player"]').forEach(($videoPlayer) => {
    new VideoPlayer($videoPlayer);
  });
  document.querySelectorAll('[data-toggle]').forEach(($toggle) => {
    new Toogle($toggle);
  });
});


