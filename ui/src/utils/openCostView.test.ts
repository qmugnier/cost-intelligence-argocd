import { describe, expect, it, vi } from 'vitest';
import { COST_VIEW_ICON, COST_VIEW_TITLE, openCostView } from './openCostView';

describe('openCostView', () => {
  it('clicks the icon of the Cost Intelligence view in the view selector', () => {
    document.body.innerHTML = `
      <i class="fa fa-th" title="Tree"></i>
      <i class="fa ${COST_VIEW_ICON}" title="${COST_VIEW_TITLE}"></i>`;
    const clicked = vi.fn();
    document.querySelector('i.' + COST_VIEW_ICON)!.addEventListener('click', clicked);

    openCostView();

    expect(clicked).toHaveBeenCalledTimes(1);
  });

  it('ignores another element with the same title that is not the view icon', () => {
    document.body.innerHTML = `<span title="${COST_VIEW_TITLE}"></span>`;
    const assign = vi.fn();

    openCostView(document, { location: { href: 'https://argocd.example/applications/argocd/web', assign } } as unknown as Window);

    expect(assign).toHaveBeenCalledTimes(1);
  });

  it('sets the view parameter and reloads when the icon is not on the page', () => {
    document.body.innerHTML = '';
    const assign = vi.fn();

    openCostView(document, { location: { href: 'https://argocd.example/applications/argocd/web?node=x', assign } } as unknown as Window);

    expect(assign).toHaveBeenCalledWith('https://argocd.example/applications/argocd/web?node=x&view=Cost+Intelligence');
  });
});
