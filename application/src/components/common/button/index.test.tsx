import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import { UIbutton, UIIconbutton } from './index';

test('Test UIbutton component', async () => {
  const { container } = render(<UIbutton onPress={()=>{ return 'button clicked' }} type="danger" size="md">UIButton</UIbutton>)
  const element:any = container.querySelector('button');
  // assert
  expect(element).toBeVisible();
  expect(element).toHaveTextContent('UIButton');
  expect(element).toHaveClass('danger');
  expect(element).toHaveClass('uiBtn');
  expect(element).toHaveClass('md');
  fireEvent.click(element, { target: { value: "button clicked" }});
});

test('Test UIIconbutton component', async () => {
  const { container } = render(<UIIconbutton onPress={()=>{ return 'button clicked' }} type="danger" size="md" icon="add">UIIconbutton</UIIconbutton>)
  const element:any = container.querySelector('button');
  // assert
  expect(element).toBeVisible();
  expect(element).toHaveTextContent('UIIconbutton');
  expect(element).toHaveClass('danger');
  expect(element).toHaveClass('uiBtn');
  expect(element).toHaveClass('iconBtn');
  expect(element).toHaveClass('md');
  expect(element.querySelector('img')).toHaveAttribute('src',"add.svg");
  fireEvent.click(element, { target: { value: "button clicked" }});
});

