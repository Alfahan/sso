@Library(['shared-library', 'pipeline-library']) _
def vault = new Vault()

// Cek panduan di wiki berikut: https://gitlab.playcourt.id/devops/devsecops-wiki
PipelineDockerEntryV2([
    // Nama project anda sesuai yang terdaftar di Playcourt. Nama sudah ditentukan di awal, mohon tidak di ubah tanpa komunikasi dengan tim Playcourt.
    projectName: 'fab-digital',

    // Prerun Script
    // Pada bagian ini anda dapat menambahkan dan mengkonfigurasikan script untuk dijalankan sebelum melakukan test atau build service yang anda buat
    prerunAgent: 'Gitops',
	prerunAgentImage: 'playcourt/jenkins:nodejs18', // "prerunAgentImage" wajib didefinisikan jika menggunakan agent Docker
    prerunScript: {
        // "prerunScript" berisi groovy script yang akan dijalankan sebelum step test dan build
        // Pada bagian ini anda juga dapat membuat variable dan menggunakannya pada script yang lain

        // contoh script untuk mengambil secret dari Vault dan menyimpannya ke dalam file .env:
        // useDotenv = vault.createDotenv("ins/instest/${env.BRANCH_NAME}/example")
    },

    // Service Test
    // Pada bagian ini anda dapat menambahkan dan mengkonfigurasikan script untuk menjalankan test pada service yang anda buat
    testAgent: 'Docker',
    testAgentImage: 'playcourt/jenkins:nodejs18', // Untuk option ini, hanya gunakan image dari https://hub.docker.com/r/playcourt/jenkins
    runTestScript: {
        // "runTestScript" berisi groovy script untuk menjalankan test
        // contoh script untuk menjalankan test pada service nodejs
        sh "npm install"
        sh "npm run test"
    },

    // Build Docker Image
    // Pada bagian ini anda dapat mengkonfigurasikan script untuk membuat image dari service yang anda buat
    // Nama dari service yang anda buat dan akan digunakan sebagai nama image docker.
    imageName: 'fab-digital-core-api-customer-sso',
	buildAgent: 'Docker',
    buildDockerImageScript: { String imageTag, String envStage ->
        // "buildDockerImageScript" berisi groovy script untuk melakukan build image
        // Image yang dibuat wajib menggunakan tag dari variable imageTag

        // contoh script untuk membuat image dan menggunakan variable yang dibuat pada prerunScript
        // sh "docker build --build-arg ARGS_NODE_BUILD=${envStage} --build-arg APP_KEY=${APP_KEY} --rm --no-cache -t ${imageTag} ."
    
        sh "docker build --build-arg ARGS_NODE_BUILD=${envStage} --rm --no-cache -t ${imageTag} ."
    },

	// Nama cluster di mana service akan dideploy. Deployment sudah ditentukan di awal, mohon tidak di ubah tanpa komunikasi dengan tim Playcourt.
    deployment: 'jtn-general',

    // Post Run Script
    // Pada bagian ini anda dapat menambahkan script untuk dijalankan setelah proses pada pipeline selesai
    postrunScript: [
        always: {
            // Pada bagian ini script akan dijalankan setiap pipeline selesai
        },

        success: {
            // Pada bagian ini script hanya akan dijalankan jika pipeline sukses
        },

        failure: {
            // Pada bagian ini script hanya akan dijalankan jika pipeline gagal
        }
    ]
])
