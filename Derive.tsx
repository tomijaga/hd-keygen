import React, { FC, useState } from 'react';

import {
  Col,
  Divider,
  InputNumber,
  Form,
  Row,
  Table,
  Typography,
  TypographyProps
} from 'antd';

import Input from 'antd/lib/input';

import { ColumnTitle } from './ColumnTitle';

import { generateMnemonic, HdWallet } from 'tnb-hd-wallet';
import { validateMnemonic } from 'bip39';

const Title: FC<TypographyProps['Title']> = ({ children, ...props }) => (
  <Typography.Title {...props}>{children}</Typography.Title>
);

export const Derive = ({ coin }: { coin: string }) => {
  // const hd: HdWallet = HdWallet[coin]()

  const [data, setData] = useState([
    {
      path: 'm/22/23//21',
      publicKey: 'iuhnivuneisunlhbseukbfjhdbsjvjhbubhjebsfhbivusenfniunsieujk',
      privateKey: 'jhksblhsbhebfshbsfhgfegkhfbheuhbjhfbsjhbhbejfhbhbhbfjshbjuhe'
    }
  ]);

  const [isPubKeyHidden, setIsPubKeyHidden] = useState(true);
  const [isPrivKeyHidden, setIsPrivKeyHidden] = useState(true);

  const [mnemonic, setMnemonic] = useState('');
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
      md: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { offset: 1, span: 16 },
      md: { offset: 1, span: 18 }
    }
  };
  const tableColumns = [
    {
      key: 'path',
      title: 'Path',
      dataIndex: 'path',
      width: '10%'
    },
    {
      key: 'path',
      title: () => (
        <ColumnTitle
          title="Public Key"
          isInitiallyOpen={false}
          onAction={(isOpen: boolean) => {
            setIsPubKeyHidden(!isOpen);
          }}
        />
      ),
      dataIndex: 'publicKey',
      width: '45%'
    },
    {
      key: 'path',
      title: () => (
        <ColumnTitle
          title="Private Key"
          isInitiallyOpen={false}
          onAction={(isOpen: boolean) => {
            setIsPrivKeyHidden(!isOpen);
          }}
        />
      ),
      dataIndex: 'privateKey',
      width: '45%'
    }
  ];
  const hideData = (publicKey: boolean, privateKey: boolean) => {
    if (!publicKey && !privateKey) return data;

    return data.map(row => {
      const copyOfRow = { ...row };
      if (publicKey) {
        copyOfRow.publicKey = '*'.repeat(row.publicKey.length);
      }
      if (privateKey) {
        copyOfRow.privateKey = '*'.repeat(row.privateKey.length);
      }
      return copyOfRow;
    });
  };

  const getEntry = (_, { mnemonic, account }) => {
    console.log(validateMnemonic(mnemonic));
    if (
      typeof mnemonic === 'string' &&
      account !== null &&
      validateMnemonic(mnemonic)
    ) {
      console.log({ mnemonic, account });
    } else {
      console.log('invalid entry');
    }
    // console.log(mnemonic, account);
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={8} xs={24} sm={8} md={6}>
          <Typography.Title level={4}>Mnemonic Phrase</Typography.Title>
        </Col>
        <Col span={16} xs={24} sm={16} md={18}>
          <Typography.Text>
            You have the option of using an existing BIP39 mnemonic or creating
            a new one at random.
            <br />
            The mnemonic requires a precise sequence and a checksum at the end,
            so you would have to follow the bip39 process to come up with a
            valid mnemonic
          </Typography.Text>
        </Col>

        <Col push={10}>
          <button
            onClick={() => {
              setMnemonic(generateMnemonic());
              console.log(mnemonic);
            }}
          >
            Generate a random Mnemonic
          </button>
          <Typography.Text> or enter one below</Typography.Text>
        </Col>
      </Row>
      <br />
      <Form
        name="keyGeneration"
        colon={false}
        requiredMark={false}
        {...formItemLayout}
        initialValues={{ account: 0, change: 0 }}
        onValuesChange={getEntry}
      >
        <Form.Item
          label={<Title level={5}>Bip39 Mnemonic</Title>}
          name="mnemonic"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            value={mnemonic}
            placeholder="12 word Mnemonic"
            onChange={e => setMnemonic(e.currentTarget.textContent)}
          />
        </Form.Item>

        <Row>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Title level={5}>Master Key Info </Title>
          </Col>
          <Col offset={2} span={22}>
            <Form.Item label="Public Key" name="masterPublicKey">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Chain Code" name="masterChainCode">
              <Input disabled value="jh bhbvfjh" />
            </Form.Item>
            <Form.Item label="Private Key" name="masterPrivateKey">
              <Input value="jhbusebubvseudfbubu" disabled />
            </Form.Item>
          </Col>
        </Row>

        <Divider />
        <Typography.Title level={3}>Bip44 Derivation Path</Typography.Title>
        <Form.Item label="Purpose" name="purpose">
          <InputNumber style={{ width: '100%' }} disabled />
        </Form.Item>
        <Form.Item label="Coin Type" name="coinType">
          <InputNumber style={{ width: '100%' }} disabled />
        </Form.Item>
        <Form.Item label="Account" name="account">
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="External/Internal" name="change">
          <InputNumber value={0} style={{ width: '100%' }} disabled />
        </Form.Item>
      </Form>
      <Divider />
      <Typography.Title level={3}>Derived Addresses</Typography.Title>
      <Table
        columns={tableColumns}
        dataSource={hideData(isPubKeyHidden, isPrivKeyHidden)}
        size="small"
        pagination={false}
        footer={() => (
          <Row justify="center">
            <Col>
              <button onClick={() => setData(prev => [...prev, ...prev])}>
                Show 20 More
              </button>
            </Col>
          </Row>
        )}
        style={{ overflowX: 'scroll' }}
      />
    </>
  );
};
