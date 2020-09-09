import { Directive, DirectiveBinding } from 'vue';

const elsRef: Element[] = [];
const bindingMap = new WeakMap<Element, DirectiveBinding<() => void>>();

let mousedownEvent: MouseEvent;
document.addEventListener('mousedown', event => mousedownEvent = event);
document.addEventListener('mouseup', mouseupEvent => {
  elsRef.forEach(el => {
    if (!mouseupEvent.target
      || !mousedownEvent.target
      || el.contains(mouseupEvent.target as any)
      || el.contains(mousedownEvent.target as any)
      || el === mouseupEvent.target) return;

    const binding = bindingMap.get(el);

    binding?.value();
  });
});

const clickOutside: Directive<Element, () => void> = {
  mounted(el, binding) {
    elsRef.push(el);
    bindingMap.set(el, binding);
  },
  updated(el, binding) {
    bindingMap.set(el, binding);
  },
  unmounted(el) {
    elsRef.splice(elsRef.indexOf(el), 1);
    bindingMap.delete(el);
  }
};

export default clickOutside;
