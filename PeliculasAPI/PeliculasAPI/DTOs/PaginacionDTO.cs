namespace PeliculasAPI.DTOs
{
    public class PaginacionDTO
    {
        private int pagina = 1;
        private int recordsPorPagina = 10;
        private readonly int cantidadMaximaRecordsPorPagina = 50;
        public int Pagina
        {
            get { return pagina; }
            set
            {
                // Min value: 0
                pagina = (value < 1) ? 1 : value;
            }
        }
        public int RecordsPorPagina
        {
            get
            {
                return recordsPorPagina;
            }
            set
            {
                // Min value: 0; Max value: 50
                recordsPorPagina = (value < 1) ? 0 : (value > cantidadMaximaRecordsPorPagina ? cantidadMaximaRecordsPorPagina : value);
            }
        }


    }
}
