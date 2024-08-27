interface FABDMetaResponse {
	per_page: number; // total data yg ditampilkan perpage (limit)
	current_page: number; // posisi halaman berada
	total_page: number; // total page
	total_filtered: number; // total data saat sudah di filter
	total: number; // total semua data (tanpa kena filter)
}

export default FABDMetaResponse;
