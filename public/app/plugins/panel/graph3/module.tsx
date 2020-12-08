import {
  FieldColorModeId,
  FieldConfigProperty,
  FieldType,
  identityOverrideProcessor,
  PanelPlugin,
} from '@grafana/data';
import {
  AxisPlacement,
  DrawStyle,
  GraphFieldConfig,
  graphFieldOptions,
  LegendDisplayMode,
  PointVisibility,
  ScaleDistribution,
  ScaleDistributionConfig,
} from '@grafana/ui';
import { GraphPanel } from './GraphPanel';
import { Options } from './types';
import { ScaleDistributionEditor } from './ScaleDistributionEditor';

export const plugin = new PanelPlugin<Options, GraphFieldConfig>(GraphPanel)
  .useFieldConfig({
    standardOptions: {
      [FieldConfigProperty.Color]: {
        settings: {
          byValueSupport: false,
        },
        defaultValue: {
          mode: FieldColorModeId.PaletteClassic,
        },
      },
    },
    useCustomConfig: builder => {
      builder
        .addRadio({
          path: 'drawStyle',
          name: 'Style',
          defaultValue: graphFieldOptions.drawStyle[0].value,
          settings: {
            options: graphFieldOptions.drawStyle,
          },
        })
        .addRadio({
          path: 'lineInterpolation',
          name: 'Line interpolation',
          defaultValue: graphFieldOptions.lineInterpolation[0].value,
          settings: {
            options: graphFieldOptions.lineInterpolation,
          },
          showIf: c => c.drawStyle === DrawStyle.Line,
        })
        .addSliderInput({
          path: 'lineWidth',
          name: 'Line width',
          defaultValue: 1,
          settings: {
            min: 0,
            max: 10,
            step: 1,
          },
          showIf: c => c.drawStyle !== DrawStyle.Points,
        })
        .addSliderInput({
          path: 'fillOpacity',
          name: 'Fill area opacity',
          defaultValue: 0.1,
          settings: {
            min: 0,
            max: 1,
            step: 0.1,
          },
          showIf: c => c.drawStyle !== DrawStyle.Points,
        })
        .addRadio({
          path: 'spanNulls',
          name: 'Null values',
          defaultValue: false,
          settings: {
            options: [
              { label: 'Gaps', value: false },
              { label: 'Connected', value: true },
            ],
          },
          showIf: c => c.drawStyle === DrawStyle.Line,
        })
        .addRadio({
          path: 'showPoints',
          name: 'Show points',
          defaultValue: graphFieldOptions.showPoints[0].value,
          settings: {
            options: graphFieldOptions.showPoints,
          },
        })
        .addSliderInput({
          path: 'pointSize',
          name: 'Point size',
          defaultValue: 5,
          settings: {
            min: 1,
            max: 10,
            step: 1,
          },
          showIf: c => c.showPoints !== PointVisibility.Never,
        })
        .addRadio({
          path: 'axisPlacement',
          name: 'Placement',
          category: ['Axis'],
          defaultValue: graphFieldOptions.axisPlacement[0].value,
          settings: {
            options: graphFieldOptions.axisPlacement,
          },
        })
        .addTextInput({
          path: 'axisLabel',
          name: 'Label',
          category: ['Axis'],
          defaultValue: '',
          settings: {
            placeholder: 'Optional text',
          },
          showIf: c => c.axisPlacement !== AxisPlacement.Hidden,
          // no matter what the field type is
          shouldApply: () => true,
        })
        .addNumberInput({
          path: 'axisWidth',
          name: 'Width',
          category: ['Axis'],
          settings: {
            placeholder: 'Auto',
          },
          showIf: c => c.axisPlacement !== AxisPlacement.Hidden,
        })
        .addCustomEditor<void, ScaleDistributionConfig>({
          id: 'scaleDistribution',
          path: 'scaleDistribution',
          name: 'Scale',
          category: ['Axis'],
          editor: ScaleDistributionEditor,
          override: ScaleDistributionEditor,
          defaultValue: { type: ScaleDistribution.Linear },
          shouldApply: f => f.type === FieldType.number,
          process: identityOverrideProcessor,
        });
    },
  })
  .setPanelOptions(builder => {
    builder
      .addRadio({
        path: 'tooltipOptions.mode',
        name: 'Tooltip mode',
        description: '',
        defaultValue: 'single',
        settings: {
          options: [
            { value: 'single', label: 'Single' },
            { value: 'multi', label: 'All' },
            { value: 'none', label: 'Hidden' },
          ],
        },
      })
      .addRadio({
        path: 'legend.displayMode',
        name: 'Legend mode',
        description: '',
        defaultValue: LegendDisplayMode.List,
        settings: {
          options: [
            { value: LegendDisplayMode.List, label: 'List' },
            { value: LegendDisplayMode.Table, label: 'Table' },
            { value: LegendDisplayMode.Hidden, label: 'Hidden' },
          ],
        },
      })
      .addRadio({
        path: 'legend.placement',
        name: 'Legend placement',
        description: '',
        defaultValue: 'bottom',
        settings: {
          options: [
            { value: 'bottom', label: 'Bottom' },
            { value: 'right', label: 'Right' },
          ],
        },
        showIf: c => c.legend.displayMode !== LegendDisplayMode.Hidden,
      });
  });
