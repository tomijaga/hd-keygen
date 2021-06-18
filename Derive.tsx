import React, { FC, useState, useEffect } from 'react';

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

import { generateMnemonic, HdWallet, Address } from 'tnb-hd-wallet';
import { validateMnemonic } from 'bip39';

const Title: FC<TypographyProps['Title']> = ({ children, ...props }) => (
  <Typography.Title {...props}>{children}</Typography.Title>
);

const newData = {
  path: '-',
  publicKey: '',
  privateKey: ''
};

const initData = Array(3).fill(newData);

export const Derive = ({ coin }: { coin: string }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(initData);

  useEffect(() => {
    const previousCoin = form.getFieldValue('coin');
    if (previousCoin !== coin) {
      form.setFieldsValue({ coin });
      getEntry(form.getFieldsValue(['mnemonic', 'account']));
    }
  });

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

  function getEntry({ mnemonic, account, coin: crypto }) {
    // console.log(crypto);
    if (
      typeof mnemonic === 'string' &&
      account !== null &&
      validateMnemonic(mnemonic)
    ) {
      // console.log({ mnemonic, account });
      const hd = HdWallet[coin](mnemonic);
      const masterKey = hd.masterKey;

      form.setFieldsValue({
        masterPublicKey: masterKey.publicKey,
        masterChainCode: masterKey.chainCode,
        masterPrivateKey: masterKey.privateKey,
        purpose: hd.purpose,
        coinType: hd.coinType
      });

      // Fill Table
      const length = data.length < 20 ? 20 : data.length;
      const accountIndex = account;
      const addresses: Address[] = [];

      for (let addressIndex = 0; addressIndex < length; addressIndex += 1) {
        addresses.push(hd.getAddress(accountIndex, addressIndex));
      }
      setData(addresses);
    } else {
      console.log('invalid entry');
    }
  }

  const showMoreAddresses = () => {
    const { mnemonic, account: accountIndex } = form.getFieldsValue([
      'mnemonic',
      'account'
    ]);

    //path of the last address
    const lastPath = data[data.length - 1].path.split('/');

    // the addressIndex (last level) in the path
    let lastAddressIndex = lastPath[lastPath.length - 1];

    //remove hardened path
    lastAddressIndex = lastAddressIndex.replace("'", '');

    //change to number
    lastAddressIndex = Number(lastAddressIndex);

    const newAddresses: Addresses[] = [];
    const hd = HdWallet[coin](mnemonic);
    for (
      let addressIndex = lastAddressIndex + 1;
      addressIndex < lastAddressIndex + 20;
      addressIndex += 1
    ) {
      newAddresses.push(hd.getAddress(accountIndex, addressIndex));
    }
    setData(prev => [...prev, ...newAddresses]);
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
              const randomMnemonic = generateMnemonic();
              setMnemonic(randomMnemonic);
              form.setFieldsValue({ mnemonic: randomMnemonic });
              form.submit();
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
        form={form}
        colon={false}
        requiredMark={false}
        {...formItemLayout}
        initialValues={{ account: 0, change: 0, coin }}
        onValuesChange={(_, values) => getEntry(values)}
        onFinish={values => getEntry(values)}
      >
        <Form.Item
          label={<Title level={5}>Bip39 Mnemonic</Title>}
          name="mnemonic"
          rules={[
            { required: true, message: 'Mnemonic is Required' },
            {
              validator: (_, value) => {
                if (value) {
                  if (value.split(' ').length >= 12) {
                    if (!validateMnemonic(value))
                      return Promise.reject(new Error('Invalid Mnemonic!'));
                  } else {
                    return Promise.reject(
                      new Error('Requires 12 or more words')
                    );
                  }
                }

                return Promise.resolve();
              }
            }
          ]}
        >
          <Input.TextArea
            allowClear
            autoSize
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
              <Input.TextArea autoSize disabled />
            </Form.Item>
            <Form.Item label="Chain Code" name="masterChainCode">
              <Input.TextArea autoSize disabled />
            </Form.Item>
            <Form.Item label="Private Key" name="masterPrivateKey">
              <Input.TextArea autoSize disabled />
            </Form.Item>
          </Col>
        </Row>

        <Divider />
        <Typography.Title level={4}>Bip44 Derivation Path</Typography.Title>
        <Form.Item label="Purpose" name="purpose">
          <InputNumber style={{ width: '100%' }} disabled />
        </Form.Item>
        <Form.Item label="Coin Type" name="coinType">
          <InputNumber style={{ width: '100%' }} disabled />
        </Form.Item>
        <Form.Item
          label="Account"
          name="account"
          rules={[{ message: 'Account value is required', required: true }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="External/Internal" name="change">
          <InputNumber style={{ width: '100%' }} disabled />
        </Form.Item>
      </Form>
      <Divider />
      <Typography.Title level={4}>Derived Addresses</Typography.Title>
      <Table
        columns={tableColumns}
        dataSource={hideData(isPubKeyHidden, isPrivKeyHidden)}
        size="small"
        pagination={false}
        footer={() => (
          <Row justify="center">
            <Col>
              <button disabled={data.length < 20} onClick={showMoreAddresses}>
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
