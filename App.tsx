import React, { useState } from 'react';

import {
  Button,
  Col,
  Divider,
  Dropdown,
  Grid,
  Layout,
  Menu,
  Row,
  Space,
  Typography
} from 'antd';

import CaretDownOutlined from '@ant-design/icons/CaretDownOutlined';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';

import GithubOutlined from '@ant-design/icons/GithubOutlined';

import { Derive } from './Derive';

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

export default function App() {
  const screens = useBreakpoint();

  // console.log(screens);

  const pagePadding = () => {
    let padding = '40px';
    if (screens.xxl) {
      padding = '150px';
    } else if (screens.xl) {
      padding = '120px';
    } else if (screens.lg) {
      padding = '90px';
    } else if (screens.md) {
      padding = '60px';
    }
    return padding;
  };

  const [chosenCoin, setChosenCoin] = useState('thenewboston');

  const switchCoin = ({ key }: any) => {
    setChosenCoin(key);
  };

  const cryptoCurrencyMenu = (
    <Menu onClick={switchCoin}>
      <Menu.Item key="bitcoin">Bitcoin</Menu.Item>
      <Menu.Item key="ethereum">Ethereum</Menu.Item>
      <Menu.Item key="thenewboston">thenewboston</Menu.Item>
    </Menu>
  );

  return (
    <div className="">
      <Layout style={{ background: 'white' }}>
        <Header
          style={{
            color: 'white',
            backgroundImage: 'linear-gradient(to bottom,#083969 0, #123 100%)',
            paddingLeft: `0px ${pagePadding()}`,
            position: 'fixed',
            zIndex: 1,
            width: '100%'
          }}
        >
          <Row justify="space-between" align="middle">
            <Col span={8}>
              <Space>
                <a href="https://github.com/tomijaga/Tnb-HD-Wallet">
                  <Button
                    type="text"
                    style={{ color: 'white', borderColor: 'white' }}
                    size="large"
                    // style={{
                    //   backgroundColor: "black",
                    //   color: "rgba(180, 180, 180, 0.8)",
                    //   border: "none"
                    // }}
                    icon={<GithubOutlined />}
                  >
                    Github
                  </Button>
                </a>

                <Button
                  style={{ color: 'white', border: 'none' }}
                  className="bright"
                  type="ghost"
                  size="large"
                >
                  Download <DownloadOutlined />
                </Button>
              </Space>
            </Col>
            <Col>
              <Dropdown overlay={cryptoCurrencyMenu}>
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: 'medium',
                    cursor: 'pointer',
                    color: 'white'
                  }}
                  className="bright"
                >
                  {chosenCoin} <CaretDownOutlined />
                </div>
              </Dropdown>
            </Col>
          </Row>
        </Header>
        <Content style={{ padding: `20px ${pagePadding()}`, marginTop: '6em' }}>
          <Typography.Title level={2}>
            Hierarchical deterministic (HD) Key Generator
          </Typography.Title>
          <Divider />
          <Derive coin={chosenCoin} />
          <Divider />
          <Typography.Title level={3}>Motivation</Typography.Title>
          <Typography.Text>
            Keeping all your crypto in a single wallet has some disadvantages
            because hackers or private investigators can track transactions back
            to you, and accounts with large amounts of coins give hackers more
            incentive to hack it.
            <br />
            <br />
            Creating multiple accounts as a solution to this problem also poses
            some risks as managing multiple keys can prove to be a difficult
            task with the added risk that they could also be misplaced.
            <br />
            <br />
            This project solves both these problems as all you need to control
            an infinite number of accounts is just a 12-word mnemonic phrase.
            With a 12-word mnemonic, you can generate keys not just for
            thenewboston alone but for other cryptocurrencies as well while
            increasing your privacy if you use different accounts for different
            transactions.
            <br />
            <br />
          </Typography.Text>
          <Typography.Text strong>
            This project was sponsored by{' '}
            <a href="https://www.thenewboston.com">thenewboston</a>, check out
            the original proposal{' '}
            <a href="https://github.com/thenewboston-developers/Projects/issues/198">
              here
            </a>
          </Typography.Text>
          <Divider />
          <Typography.Title level={3}>Alternative Tools</Typography.Title>
          Some similar tools to this are:
          <br />
          <br />
          <a href="https://bip32jp.github.io/english/index.html">
            https://bip32jp.github.io/english/index.html
          </a>
          <br />
          <a href="https://iancoleman.io/bip39/">
            https://iancoleman.io/bip39/
          </a>
          <br />
          <a href="https://microbitcoinorg.github.io/mnemonic/">
            https://microbitcoinorg.github.io/mnemonic/
          </a>
          <Divider />
          <Row justify="space-between">
            <Col>
              Check out other thenewboston{' '}
              <a href="https://www.thenewboston.com/projects">projects</a>{' '}
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
}
