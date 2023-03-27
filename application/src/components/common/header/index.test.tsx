import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import UIHeader from './index';

test('Checking header component render correctly', async () => {
  const { container } = render(<UIHeader/>);

  const element:any = container.querySelector('.header');
  // assert
  expect(element).toBeVisible();
});

test('Checking HammerBerg Button element present in header component', async () => {
  const { container } = render(<UIHeader/>);

  const element:any = container.querySelector('.header .hammerberg');
  // assert
  expect(element).toBeVisible();
  expect(element.querySelector('img')).toHaveAttribute('src',"hammerberg.svg");
});

test('Checking Breadcrumb element present in header component', async () => {
  const { container } = render(<UIHeader/>);

  const element:any = container.querySelector('.header .ant-breadcrumb');
  // assert
  expect(element).toBeVisible();
});

test('Checking UserInfo section present in header component', async () => {
  const { container } = render(<UIHeader/>);

  const element:any = container.querySelector('.header .profileImageSection');
  // assert
  expect(element).toBeVisible();
  expect(element.querySelector('.profileImage')).toBeVisible();
  expect(element.querySelector('.info')).toBeVisible();
  expect(element.querySelector('.info .name')).toBeVisible();
  expect(element.querySelector('.info .role')).toBeVisible();
  expect(element.querySelector('.icon')).toBeVisible();
});


test('Checking header component position is fixed', async () => {
    const { container } = render(<UIHeader/>);
    const element:any = container.querySelector('.header');
    // assert
    expect(element).toBeVisible();
    expect(element).toHaveClass('fixedHeader');
  });

test('Checking header component logo is present', async () => {
    const { container } = render(<UIHeader/>);
    const element:any = container.querySelector('.ant-layout-header .logo');
    // assert
    expect(element).toBeInTheDocument();
    expect(element).toBeVisible();
  });