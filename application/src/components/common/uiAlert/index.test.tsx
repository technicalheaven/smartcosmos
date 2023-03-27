import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import { UIAlert, UIErrorAlert} from './index';

test('Checking UIAlert component render correctly', async () => {
  const { container } = render(<UIAlert message="This is alert" type="success"/>);
  const element = container.querySelector('.uiAlert');
  // assert
  expect(container).toBeInTheDocument();
  expect(container).toBeVisible();
  expect(element).toHaveClass('uiAlert');
});

test('Checking UIAlert component render message correctly', async () => {
  const { container } = render(<UIAlert message="This is alert" type="success"/>);
  // assert
  expect(container).toHaveTextContent('This is alert');
});

test('Checking UIAlert component render correct type of alert', async () => {
  const { container } = render(<UIAlert message="This is alert" type="success"/>);
  const element = container.querySelector('.uiAlert');
  // assert
  expect(element).toHaveClass('success');
});



test('Checking UIAlert component have close button', async () => {
  const { container } = render(<UIAlert message="This is alert" type="success"/>);
  const element = container.querySelector('.uiAlert');
  // assert
  expect(element?.querySelector('.close')).toHaveClass('close');
  expect(element?.querySelector('.close img')).toHaveAttribute('src',"close.svg");
});

test('Checking UIAlert component when click on close button alert is closed', async () => {
  const { container } = render(<UIAlert message="This is alert" type="success"/>);
  const element:any = container.querySelector('.uiAlert .close');
  // assert
  fireEvent.click(element);
  expect(container?.querySelector('.uiAlert')).not.toBeInTheDocument();
});

test('Checking UIErrorAlert component render correctly', async () => {
  const { container } = render(<UIErrorAlert message="This is error alert" type="error"/>);
  const element = container.querySelector('.uiAlert');
  // assert
  expect(container).toBeInTheDocument();
  expect(container).toBeVisible();
  expect(element).toHaveClass('errorAlert');
});

test('Checking UIErrorAlert component render message correctly', async () => {
  const { container } = render(<UIErrorAlert message="This is error alert" type="error"/>);
 // assert
 expect(container).toHaveTextContent('This is error alert');
});

test('Checking UIErrorAlert component render correct type of alert', async () => {
  const { container } = render(<UIErrorAlert message="This is error alert" type="error"/>);
  const element = container.querySelector('.uiAlert');
  // assert
  expect(element).toHaveClass('error');
});



