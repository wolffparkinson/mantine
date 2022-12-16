import React from 'react';
import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/styles';

const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export function itSupportsProviderSize<P>(
  Component: React.ComponentType<P>,
  requiredProps: P,
  componentName: string,
  selector: string | string[] = 'root'
) {
  it('supports size on MantineProvider', () => {
    const selectors = Array.isArray(selector) ? selector : [selector];
    const colors = Array(selectors.length)
      .fill(0)
      .map(() => randomColor());

    const { container } = render(
      <MantineProvider
        theme={{
          components: {
            [componentName]: {
              sizes: (_theme, size) => {
                if (size === 'provider-size') {
                  return selectors.reduce((acc, part, index) => {
                    acc[part] = { backgroundColor: colors[index] };
                    return acc;
                  }, {});
                }

                return null;
              },
            },
          },
        }}
      >
        <Component {...requiredProps} size="provider-size" />
      </MantineProvider>
    );

    selectors.forEach((part, index) => {
      expect(container.querySelector(`.mantine-${componentName}-${part}`)).toHaveStyle({
        backgroundColor: colors[index],
      });
    });
  });
}
