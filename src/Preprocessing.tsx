import './Preprocessing.css';

export function Preprocessing({preprocessImage, contourImage, segmentsImages} : { preprocessImage: string, contourImage: string, segmentsImages: string[] }) {
    return (
        <div className="preprocess center-div">
            <section className="preprocess__masking">
                <h2>We <b>processed</b> your image like this...</h2>
                <div className="center-div">
                    <img src={preprocessImage} alt="Preprocessed Image" id="masking__image" />
                    <img src={contourImage} alt="Contour Image" id="contour__image" />
                </div>
            </section>
            <section className="preprocess__segmentation">
                <h2><b>Take a peek</b> at the segmented image</h2>
                <div className="center-div">
                    {segmentsImages.map((image, index) => (
                        <img key={index} src={image} alt={`Segment ${index + 1}`} className="segment__image" />
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Preprocessing;