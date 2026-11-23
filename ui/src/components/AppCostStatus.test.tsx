import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppCostStatus } from './AppCostStatus';

const costData = vi.hoisted(() => ({ current: null as unknown, daily: null as unknown }));
vi.mock('../hooks/useCostData', () => ({ useCostData: () => ({ data: costData.current, dailyCosts: costData.daily }) }));
vi.mock('../hooks/useMeasuredClusters', () => ({ useMeasuredClusters: () => [] }));

const application = { metadata: { name: 'web', namespace: 'argocd' }, spec: { project: 'default' } };

describe('AppCostStatus', () => {
  it('shows the monthly cost with its idle part as detail, not as an addend', () => {
    costData.current = {
      scope: 'application',
      totalMonthlyCost: 100,
      efficiency: { cpuIdleCost: 20, ramIdleCost: 5 },
      cloudEstimate: { totalMonthlyCost: 10 },
    };
    render(<AppCostStatus application={application} />);

    expect(screen.getByText('$110.00')).toBeTruthy();
    expect(screen.getByText('Kubernetes $100.00 + cloud $10.00, incl. $25.00 idle')).toBeTruthy();
  });

  it('shows nothing before there is a measurement', () => {
    costData.current = null;
    const { container } = render(<AppCostStatus application={application} />);

    expect(container.textContent).toBe('');
  });

  // days gives one day per entry, ending yesterday; a series that starts inside the window has a partial first day.
  const days = (costs: number[]) =>
    costs.map((totalCost, i) => ({
      date: new Date(Date.now() - (costs.length - i) * 86_400_000).toISOString().slice(0, 10),
      totalCost,
      cpuCost: 0,
      memoryCost: 0,
      networkCost: 0,
      storageCost: 0,
    }));

  it.each([
    ['a rising cost is a red arrow up', 13, 'Rising', 'fa-arrow-up', 'rgb(233, 109, 118)'],
    ['a small rise is amber', 10.7, 'Rising', 'fa-arrow-up', 'rgb(244, 192, 48)'],
    ['a falling cost is a green arrow down', 7, 'Falling', 'fa-arrow-down', 'rgb(24, 190, 148)'],
    ['a steady cost is a green arrow across', 10.2, 'Steady', 'fa-arrow-right', 'rgb(24, 190, 148)'],
  ])('marks the trend: %s', (_name, recent, label, icon, color) => {
    costData.current = { scope: 'application', totalMonthlyCost: 100 };
    costData.daily = days([1, ...Array(7).fill(10), ...Array(7).fill(recent)]);
    render(<AppCostStatus application={application} />);

    const marker = screen.getByRole('img', { name: label });
    expect(marker.className).toContain(icon);
    expect((marker.parentElement as HTMLElement).style.color).toBe(color);
    costData.daily = null;
  });
});
