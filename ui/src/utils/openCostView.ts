// How the Cost Intelligence view is registered with Argo CD (src/index.tsx): its title, and its icon
// in the application's view selector, next to the tree, pods, network and list views.
export const COST_VIEW_TITLE = 'Cost Intelligence';
export const COST_VIEW_ICON = 'fa-dollar-sign';

// openCostView shows the Cost Intelligence view of the application, as a click on its icon does.
//
// Argo CD gives an extension no way to switch the view from outside (the status panel's `openFlyout`
// opens a flyout, which is something else), so this clicks the view selector's own icon: that works
// whatever the Argo CD version stores in the URL. Without the icon on the page it sets the `view`
// parameter, which Argo CD reads when the page loads, and reloads.
export function openCostView(doc: Document = document, win: Window = window): void {
  const icon = Array.from(doc.querySelectorAll<HTMLElement>('i[title], button[title]')).find(
    el => el.getAttribute('title') === COST_VIEW_TITLE && (el.tagName === 'BUTTON' || el.classList.contains(COST_VIEW_ICON))
  );
  if (icon) {
    icon.click();
    return;
  }
  const url = new URL(win.location.href);
  url.searchParams.set('view', COST_VIEW_TITLE);
  win.location.assign(url.toString());
}
