import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React from 'react';

export enum Metric {
  RegressionProtection = 'RegressionProtection',
  RefactoringAllowance = 'RefactoringAllowance',
  Maintainability = 'Maintainability',
  Speed = 'Speed',
}

export const BalancedMetricsTip: React.FC<{ improves: Metric[] }> = ({
  improves,
}) => (
  <MetricsTip
    improves={improves}
    degrades={Object.values(Metric).filter(
      (metric) => !improves.includes(metric)
    )}
  />
);

export const MetricsTip: React.FC<{
  improves?: Metric[];
  degrades?: Metric[];
}> = ({ improves = [], degrades = [] }) => {
  const { i18n } = useDocusaurusContext();
  const icons = useMetricToIcon();

  const _improves = improves.map((metric) => icons[metric]);
  const _degrades = degrades.map((metric) => icons[metric]);

  return (
    <div>
      {_improves.length > 0 && (
        <div style={{ color: 'green' }}>
          {_improves} {i18n.currentLocale === 'en' ? 'Improves' : 'Улучшает'}
        </div>
      )}
      {_degrades.length > 0 && (
        <div style={{ color: 'red' }}>
          {_degrades} {i18n.currentLocale === 'en' ? 'Harms' : 'Ухудшает'}
        </div>
      )}
      <br />
    </div>
  );
};

function useMetricToIcon() {
  const { i18n } = useDocusaurusContext();

  return {
    [Metric.RegressionProtection]: (
      <Link
        to="/specification/metrics#regression-protection"
        title={
          i18n.currentLocale === 'en'
            ? 'Regression Protection'
            : 'Защита от регресса'
        }
      >
        🛡
      </Link>
    ),
    [Metric.RefactoringAllowance]: (
      <Link
        to="/specification/metrics#refactoring-resilience"
        title={
          i18n.currentLocale === 'en'
            ? 'Refactoring Resilience'
            : 'Устойчивость к рефакторингу'
        }
      >
        🔧
      </Link>
    ),
    [Metric.Maintainability]: (
      <Link
        to="/specification/metrics#maintainability"
        title={
          i18n.currentLocale === 'en' ? 'Maintainability' : 'Поддерживаемость'
        }
      >
        📈
      </Link>
    ),
    [Metric.Speed]: (
      <Link
        to="/specification/metrics#performance"
        title={i18n.currentLocale === 'en' ? 'Performance' : 'Быстродействие"'}
      >
        ⚡
      </Link>
    ),
  } satisfies Record<Metric, unknown>;
}
