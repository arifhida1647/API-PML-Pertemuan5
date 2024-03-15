const express = require("express");
const admin = require("firebase-admin");
const app = express();
const router = express.Router();

const firebaseConfig = {
    databaseURL: "https://arif-9e465-default-rtdb.firebaseio.com", // Your database URL
    credential: {
      type: "service_account",
      project_id: "arif-9e465",
      private_key_id: "a5721268ff76abd9c7cad579085a16dc3954fa1a",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCM3x10Keh4ZiNr\nvMv4Q96iFqJBqJub4rpLKSlpE8E6OyOYWglLhdfj80/jgY8RZHqo46SGOi8uIQ7/\n/zJ80fsCeq89wwe0NTVhtW6UIM/OU/pHckqJLhME4UGCUsAjikPsE+yKA8aqH6gn\nsi+t72srIEIO0WZQKrn/vNsX0GOwYdD5UzAB1Dw5Miu5rsIheJBOkNehQd/dYxiV\n2dPWXAdRWDI0D03PCXPmCI1rtW8/M7BdW4D96gdbZIjyP7SoYAsynBgJfm7aGiql\nBk1G9oB0kyNf7JdlxjSYToXdkE8DijXfSKnlgA9u65cWMfH2IteaWPoKsv0GboSI\nUqSE/FnDAgMBAAECggEAPvFQBT/WZblpWTGtx1t35d+MFx9BjAjlqUCWhqMzgpO7\nB08veQWwHWNxThts89376mtwbyMfQpK1049QnTHrYEO1+jgiwJPHqsU4x8nTYALo\nwLSh9iJWkCcfsJ3NyPN1/s02MsKWKRxk83urzyE7NrU+nsVUXDyDB+/3yu+rIzsf\nvoObguSMcnqnlI2prCSgp78rnG9b4E+TvSN0OQ4aCR4kd8rV2ACSh8LagQmAK0Rp\nuOpnIQMNCrG7xGqgFSFcWBt2M2l5R5Pj1HRRSSM0UDw/UwEpf3MU82VTYIlG2B0e\nEu8Pt5V1SRd1NMkPNfCsAKGkQqZ1uPGTJ32Pc8XyVQKBgQDAl6KW6SQ3PP56uJAO\nhLLhkprcLnrFb/AEbrC+DOYptbmLqB4MTCKROsSeP363iWoghMzyb0tPeXjfsC8S\nP4KFECUkz0Zu91SnFue2LTHQ49k8XDSYSs+/71P9hSyFWH3Fku0mu8398hw4Wsmj\nvgldSmBw9HG0Uk0PpsS1pjisfwKBgQC7QETTWgBvBZKqCgoZHjSc0Df1SdQYm42Y\nFCBldx8WaynNj26uqFQ1ijYWnFkv66K17e5VhtMVvk5Of058sC6grUmLK/0qbi0+\nWN0duuDNRui0Vj0T+PZ2AJIopuQbEMD/p/R8Z1mYnCiCcnVWDoWGoLgOg/8pa3Kt\nXGWOhFsAvQKBgEJvTD/AdqSzXplYtyC697XGS7MuOV2ICoSM5lz4uCClNjcNrCfT\nz4zHd/Gat4x6U2iaRtROPe1RWrfW37XswIpEEnwLICHBIattxEpcdrW3E0W2DNKH\n4/gyh4eJe90XtHMGBtZ4rEswTDnIX4wjTrmmoXP1bo+kYD7I6Uw75YrjAoGADUth\n15OjRj6iDBqMXv4rBBswbeTg/yJEKlD7f9i2R1QycprFY/cli2uVrYNKPcHAGqSa\n8E2TPQ725lHZk7a6iMPk3dGwtst9wNh0UoELJufq66rXyUw6y2P8/I/k0BsfaMdW\n72IzFUe5BJH1zLdZOZa9mqI6golTagWOXFD/WQ0CgYBVkYLcYhyQh12+G9iDV4fb\nvifQ9j1JpBaT8VZFnkCdaexE7QFw+cQA2CT2CGEdTMTI/cpgm0sYt1ERGX3jr358\nbaBxxKewESxnz9wxA2ndnQIqDW6/kL+1xI9GS5fVUAV6GiUzFkAZTcT/IxL5v6cb\nNft1Thz9BipQ20Jh86Qm8g==\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk-38rwh@arif-9e465.iam.gserviceaccount.com",
      client_id: "104277397664783188006",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-38rwh%40arif-9e465.iam.gserviceaccount.com",
      universe_domain: "googleapis.com"
    }
  };
  
  // Initialize Firebase Admin SDK with credentials
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig.credential),
    databaseURL: firebaseConfig.databaseURL
  });
  

// Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/login", (req, res) => {
  const { username, password } = req.query; // Mendapatkan username dan password dari query parameters
  if (!username || !password) {
    return res.status(400).send("Username dan password diperlukan");
  }

  const ref = admin.database().ref(); // Referensi utama (root)
  ref
    .once("value", (snapshot) => {
      const users = snapshot.val(); // Mendapatkan semua data pengguna
      const userData = users && users[username]; // Mendapatkan data pengguna berdasarkan username
      if (userData) {
        const storedPassword = userData.password;
        if (password === storedPassword) {
          res.status(200).send("Berhasil login");
        } else {
          res.status(404).send("Password salah");
        }
      } else {
        res.status(404).send("Pengguna tidak ditemukan");
      }
    })
    .catch((error) => {
      res.status(500).send("Gagal mengambil data dari Firebase");
    });
});

router.get("/task", (req, res) => {
  const { usernameParams } = req.query; // Mendapatkan username dari query parameters
  if (!usernameParams) {
    return res.status(400).send("Login terlebih dahulu");
  }

  const ref = admin.database().ref(usernameParams); // Mendapatkan referensi spesifik berdasarkan username
  ref
    .once("value", (snapshot) => {
      const userData = snapshot.val(); // Mendapatkan data pengguna berdasarkan username
      if (userData && userData.task) {
        const tasks = userData.task; // Mendapatkan task dari data pengguna
        res.status(200).json(tasks); // Mengirimkan task sebagai respons JSON
      } else {
        res.status(404).send("Tidak ada task untuk pengguna ini");
      }
    })
    .catch((error) => {
      res.status(500).send("Gagal mengambil data dari Firebase");
    });
});

module.exports = router;
