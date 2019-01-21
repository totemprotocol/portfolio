import Component from '@ember/component';
import layout from '../templates/embedded';
import { computed } from '@ember/object';
import { displayDecimalPlaces } from 'portfolio-common/helpers/convert-currency';
import { symbolMapping } from 'portfolio-common/helpers/currency-symbol';

export default Component.extend({
  layout,
  init() {
    this._super();
    this.set('currency', 'USD');
    this.set('chartOptions', {
      chart: {
        styledMode: true,
        rangeSelector: {
          selected: 1
        },
      }
    });
  },

  // TODO need to use "dynamic" data service: https://github.com/ahmadsoe/ember-highcharts/blob/master/tests/dummy/app/components/chart-highstock-interactive.js
  chartData: computed('currency', 'content.{timeseries,historyValues.@each.balance}', function() {
    let currency = this.get('currency');
    let timeseries = Object.assign({}, this.get('content.timeseries'));

    return [{
      name: `${currency} value`,
      step: true,
      tooltip: {
        valueDecimals: displayDecimalPlaces[currency] || 2,
        valuePrefix: symbolMapping[currency] || '',
      },
      data: timeseries[currency]
    }];
  })
});