import {render, act, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import UISidebar from './index';
import {BrowserRouter} from 'react-router-dom'

test('Checking UISidebar component rendering properly', async () => {
  const { container } = render(
 <BrowserRouter>
   <UISidebar/>
 </BrowserRouter>
  )
  const element:any = container.querySelector('.ant-layout-sider');
  // assert
  await act(async () => {
    expect(element).toBeVisible();
  })
});

test('Checking UISidebar component have menu element', async () => {
  const { container } = render(
 <BrowserRouter>
   <UISidebar/>
 </BrowserRouter>
  )
  const element:any = container.querySelector('.ant-layout-sider .ant-layout-sider-children .ant-menu');
  // assert
  await act(async () => {
    expect(element).toBeInTheDocument();
  })
});

test('Checking UISidebar component have logout button', async () => {
  const { container } = render(
 <BrowserRouter>
   <UISidebar/>
 </BrowserRouter>
  )
  const element:any = container.querySelector('.signoutBtnContainer .signoutBtn');
  // assert
  await act(async () => {
    expect(element).toBeInTheDocument();
  })
});


