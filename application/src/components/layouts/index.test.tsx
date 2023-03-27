import {render, act, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import UILayout from './index';
import {BrowserRouter} from 'react-router-dom'

test('Checking UILayout component rendering properly', async () => {
  const { container } = render(
 <BrowserRouter>
   <UILayout/>
 </BrowserRouter>
  )
  const element:any = container.querySelector('.ant-layout');
  // assert
  await act(async () => {
    expect(element).toBeInTheDocument();
  })
  
});

test('Checking UILayout component contains header, footer, content area and sidebar', async () => {
  const { container } = render(
 <BrowserRouter>
   <UILayout/>
 </BrowserRouter>
  )
  const element:any = container.querySelector('.ant-layout');
  // assert
  await act(async () => {
    expect(element.querySelector('.ant-layout-header')).toBeInTheDocument();
    expect(element.querySelector('.ant-layout-sider')).toBeInTheDocument();
    expect(element.querySelector('.ant-layout-content')).toBeInTheDocument();
    expect(element.querySelector('.ant-layout-footer')).toBeInTheDocument();
  })
});

