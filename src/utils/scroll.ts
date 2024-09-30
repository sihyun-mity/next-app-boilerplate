let scrollPosition: number = 0;
let isLocked: boolean = false;

const scroll = {
  lock: () => {
    scrollPosition = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
    isLocked = true;
  },

  unlock: () => {
    if (!isLocked) return;
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, scrollPosition);
  },
};

export default scroll;
