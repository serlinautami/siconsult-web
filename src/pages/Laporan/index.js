import {
  React,
  Container,
  Row,
  Col,
  useEffect,
  useState,
  FormGroup,
  Table,
  moment
} from '../../libraries';
import { Loading } from '../../components';
import { useQuery, readReportType } from '../../utils';
import { getReportById } from '../../configs';

const Laporan = () => {
  const query = useQuery();
  const reportId = query.get('id');
  const reportType = query.get('type');

  const [report, setReport] = useState({});
  const [showLoading, setLoading] = useState(true);

  useEffect(() => {
    if (reportId && reportType) {
      getReportById(reportType, reportId)
        .then(result => {
          setReport(result);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          console.error(err);
        });
    }
  }, [reportId, reportType]);

  const renderDaftarMasalah = () => {
    if (report.reportedMasalah && report.reportedMasalah.length > 0) {
      return (
        <React.Fragment>
          <h4 className="mb-3">
            <strong>Daftar Masalah Konsultasi</strong>
          </h4>
          <Table className="mb-5" responsive bordered size="sm">
            <thead>
              <tr>
                <th className="text-center" style={{ width: 30 }}>
                  No
                </th>
                <th className="text-center">Masalah</th>
                <th className="text-center">Kategori</th>
                <th className="text-center">Keterangan</th>
                <th className="text-center">Jumlah Konsultasi</th>
                <th className="text-center">Mahasiswa</th>
              </tr>
            </thead>
            <tbody>
              {report.reportedMasalah.map((itemMasalah, index) => (
                <tr key={itemMasalah.id}>
                  <td className="text-center">{index + 1}</td>
                  <td>{itemMasalah.title}</td>
                  <td className="text-center">{itemMasalah.categoryId}</td>
                  <td>{itemMasalah.description}</td>
                  <td className="text-center">{itemMasalah.count}</td>
                  <td>
                    <div>
                      {itemMasalah.users && itemMasalah.users.length > 0 ? (
                        <React.Fragment>
                          <ul className="list-unstyled">
                            {itemMasalah.users.map(user => (
                              <li key={user.uid}>{user.fullName}</li>
                            ))}
                          </ul>
                        </React.Fragment>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </React.Fragment>
      );
    }
    return null;
  };

  const renderDaftarUser = () => {
    if (report.reportedUsers && report.reportedUsers.length > 0) {
      return (
        <React.Fragment>
          <h4 className="mb-3">
            <strong>Daftar Mahasiswa yang Berkonsultasi</strong>
          </h4>
          <Table className="mb-5" responsive bordered size="sm">
            <thead>
              <tr>
                <th className="text-center" style={{ width: 30 }}>
                  No
                </th>
                <th className="text-center">NPM</th>
                <th className="text-center">Nama Lengkap</th>
                <th className="text-center">Email</th>
                <th className="text-center">Nomor HP</th>
                <th className="text-center">Jumlah Konsultasi</th>
              </tr>
            </thead>
            <tbody>
              {report.reportedUsers.map((user, index) => (
                <tr key={user.uid}>
                  <td className="text-center">{index + 1}</td>
                  <td>{user.idNumber}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.telphon}</td>
                  <td className="text-center">{user.count}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </React.Fragment>
      );
    }

    return null;
  };

  const renderRiwayatChat = () => {
    if (report.reportedMasalah && report.reportedMasalah.length > 0) {
      return (
        <React.Fragment>
          <h4 className="mb-3">
            <strong>Riwayat Konsultasi</strong>
          </h4>
          {report.reportedMasalah &&
            report.reportedMasalah.map((itemMasalah, index) => (
              <div key={index}>
                <h5 className="mb-3">
                  <strong>{`${index + 1}. ${itemMasalah.title}`}</strong>
                </h5>
                <Row>
                  {itemMasalah.users && itemMasalah.users.length > 0 ? (
                    <React.Fragment>
                      {itemMasalah.users.map((user, x) => {
                        const userData = { ...user };
                        return (
                          <Col key={x} sm={12} md={6}>
                            <div className="border p-3 mb-3">
                              <ul className="list-unstyled mb-3">
                                <li>Nama: {userData.fullName}</li>
                                <li>NPM: {userData.idNumber}</li>
                                <li>Konsultasi: {itemMasalah.title}</li>
                                <li>Kategori: {itemMasalah.categoryId}</li>
                              </ul>

                              {userData.chats && userData.chats.length > 0 ? (
                                <ul className="list-unstyled">
                                  {userData.chats.map((chat, i) => (
                                    <li key={i}>
                                      <div className="border-bottom pb-2 font-smaller">{`Tanggal: ${moment(
                                        chat.id,
                                        'YYYY-MM-DD'
                                      ).format('DD MMMM YYYY')}`}</div>
                                      <ul className="list-unstyled">
                                        {chat.data && chat.data.length > 0 ? (
                                          <React.Fragment>
                                            {chat.data.map((itemChat, j) => {
                                              const isUser =
                                                userData.uid ===
                                                itemChat.data.sendBy;
                                              return (
                                                <li
                                                  key={j}
                                                  className="border-bottom py-1 d-flex"
                                                >
                                                  <div>
                                                    <strong>
                                                      {isUser
                                                        ? userData.fullName
                                                        : 'Kajur'}{' '}
                                                      :
                                                    </strong>
                                                  </div>
                                                  <div style={{ flex: 1 }}>
                                                    {itemChat.data.chatContent}
                                                  </div>
                                                  <div>
                                                    {itemChat.data.chatTime}
                                                  </div>
                                                </li>
                                              );
                                            })}
                                          </React.Fragment>
                                        ) : null}
                                      </ul>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </div>
                          </Col>
                        );
                      })}
                    </React.Fragment>
                  ) : null}
                </Row>
              </div>
            ))}
        </React.Fragment>
      );
    }

    return null;
  };

  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col sm={12}>
            <FormGroup row className="pt-5">
              <Col xs={3} sm={4} md={3} lg={2}>
                Nama Laporan
              </Col>
              <Col>
                : <strong>{report.reportName}</strong>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col xs={3} sm={4} md={3} lg={2}>
                Tipe Laporan
              </Col>
              <Col>: {readReportType(reportType)}</Col>
            </FormGroup>
            <FormGroup row>
              <Col xs={3} sm={4} md={3} lg={2}>
                ID Laporan
              </Col>
              <Col>: {report.reportId}</Col>
            </FormGroup>
            <FormGroup row>
              <Col xs={3} sm={4} md={3} lg={2}>
                Konsultasi
              </Col>
              <Col>{`: ${report.count} Konsultasi`}</Col>
            </FormGroup>
            <FormGroup row className="mb-5">
              <Col xs={3} sm={4} md={3} lg={2}>
                Mahasiswa
              </Col>
              <Col>
                :{' '}
                {report.reportedUsers && report.reportedUsers.length
                  ? `${report.reportedUsers.length} Orang`
                  : '-'}
              </Col>
            </FormGroup>
            {renderDaftarUser()}
            {renderDaftarMasalah()}
            {renderRiwayatChat()}
          </Col>
        </Row>
      </Container>
      <Loading show={showLoading} />
    </React.Fragment>
  );
};

export default Laporan;
