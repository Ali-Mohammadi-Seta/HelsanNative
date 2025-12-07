import { useState } from 'react';
import { Card,  Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import folder from '@/assets/images/folder1.png';
import { Modal } from "@/components/modal/Modal";
// import { convertMiladiToShamsiDate } from '@/utils/convertMiladiToShamsi';
// import { downloadFile } from '@/utils/downloadFile'; // if available
// import { Icon } from '@/components/common/Icon'; // Adjust import as needed

interface DocumentFile {
  file: string;
  title: string;
  date: string;
  doneDate?: string;
}

interface DocRecord {
  _id: string;
  title?: string;
  docType?: string;
  createDate?: string;
  doneDate?: string;
  documents: DocumentFile[];
}

interface PatientInfo {
  nationalId?: string;
}

interface PatientFilesProps {
  patientInfo?: PatientInfo;
}

const PatientFiles: React.FC<PatientFilesProps> = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [docs, setDocs] = useState<DocRecord[]>([]);

  // const getPatientFiles = async (nationalId: string) => {
  //   setLoading(true);
  //   const result = await apiCall.get(endpoints.getUserDocuments(nationalId));
  //   setLoading(false);
  //   if (result.isSuccess) {
  //     setDocs(result.data?.data?.docs || []);
  //   }
  // };

  const showModal = () => {
    setIsModalVisible(true);
    // if (patientInfo?.nationalId) {
    //   getPatientFiles(patientInfo.nationalId);
    // }
  };

  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  const downloadHandler = (record: DocRecord) => {
    const file = record?.documents?.[0]?.file;
    if (file) {
      // downloadFile(file);
      console.log('Download:', file);
    }
  };

  const columns: ColumnsType<DocRecord> = [
    {
      title: t('onvan'),
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      render: (_, record) => record.documents?.[0]?.title || '-',
    },
    {
      title: t('docType'),
      dataIndex: 'docType',
      key: 'docType',
      align: 'center',
    },
    {
      title: t('uploadDate'),
      dataIndex: 'createDate',
      key: 'createDate',
      align: 'center',
    //   render: (_, record) =>
    //     convertMiladiToShamsiDate(record.documents?.[0]?.date),
    },
    {
      title: t('doneDate'),
      dataIndex: 'doneDate',
      key: 'doneDate',
      align: 'center',
    //   render: (_, record) =>
    //     convertMiladiToShamsiDate(record.documents?.[0]?.doneDate) || '-',
    },
    {
      title: t('action'),
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Tooltip
          title={t('downLoad')}
          overlayClassName="actions__tooltip"
          className="cursor-pointer"
        >
          <span className="action__inner" onClick={() => downloadHandler(record)}>
            {/* Replace with actual Icon if available */}
            <i className="fas fa-download text-[#717F94] text-[18px]" />
          </span>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Card
        onClick={showModal}
        className="cursor-pointer mt-[0%] flex flex-col items-center justify-center text-[#333]
        border-solid !rounded-md text-[13px] bg-[#fff]
        !shadow-[0px_1px_5px_0px_rgb(0,0,0,20%),0px_2px_2px_0px_rgb(0,0,0,14%),0px_3px_1px_-2px_rgb(0,0,0,12%)]
        border-[#fff] !h-[90px] !w-[145px] hover:shadow-none hover:border-2 hover:border-[#5394DE]"
      >
        <img
          src={folder}
          alt="Diagnosis"
          className="mb-2 w-[35px] h-[35px] mx-auto"
        />
        <p>{t('madarekePezeshki')}</p>
      </Card>

      <Modal
        title={t('madarekePezeshki')}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        <Table<DocRecord>
          columns={columns}
          bordered={false}
        //   dataSource={docs}
        //   loading={loading}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 3, size: 'small' }}
          scroll={{ x: 500 }}
        />
      </Modal>
    </>
  );
};

export default PatientFiles;
