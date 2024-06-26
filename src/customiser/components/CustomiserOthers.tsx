import PropTypes from 'prop-types';
import { useState } from 'react';
import CustomiserItemDetailsList from './CustomiserItemDetailsList';
import CustomiserOtherPreviousEntries from './CustomiserOtherPreviousEntries.js';
import { Tooltip } from 'react-tooltip';
import TooltipIcon from '../../assets/tooltip.svg?react';

interface OtherItem {
    id: number | null;
    title: string;
    link: string;
    detailsList: { id: number; text: string }[]; 
    formType: string;
}

interface DetailItem {
    id: number;
    text: string;
}

interface CustomiserOtherProps {
    otherSection: OtherItem[];
    setOtherSection: React.Dispatch<React.SetStateAction<OtherItem[]>>;
    formType: string;
}

const CustomiserOther: React.FC<CustomiserOtherProps> = ({ otherSection, setOtherSection, formType }) => {
    const [idCounter, setIdCounter] = useState<number>(0);

    const [title, setTitle] = useState<string>('');
    const [link, setLink] = useState<string>('');

    const [detailsList, setDetailsList] = useState<DetailItem[]>([]);
    const [detailIdCounter, setDetailIdCounter] = useState<number>(0);

    const [editingId, setEditingId] = useState<number | null>(null);

    const [order, setOrder] = useState<number[]>([]);

    const isArrayFilled: boolean = otherSection.length > 0;

    const sortOtherSection = (
        otherSection: OtherItem[], 
        order: number[]
    ): void => {
        const sortedOtherSection: OtherItem[] = otherSection.sort((a, b) => {
            const indexA = order.indexOf(a.id ?? -1);
            const indexB = order.indexOf(b.id ?? -1);
            return indexA - indexB;
        });

        setOtherSection(sortedOtherSection);
    };

    const handleDetailsListAdd = (newDetail: string): void => {
        let newDetailsList: DetailItem[] = [...detailsList, { id: detailIdCounter, text: newDetail }];
        setDetailsList(newDetailsList);
        setDetailIdCounter(detailIdCounter + 1);
    };

    const handleOtherItemAdd = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const addedOtherItem: OtherItem = {
            id: editingId !== null ? editingId : idCounter,
            title: e.target.titleInput.value,
            link: formType !== 'skills' ? e.target.linkInput.value : '',
            detailsList: detailsList,
            formType: formType,
        };

        let newOtherSectionHistory: OtherItem[];

        if (editingId !== null) {
            // Editing -> Replace the existing entry with edited entry
            newOtherSectionHistory = otherSection.map((otherSectionItem) => {
                return otherSectionItem.id === editingId ? addedOtherItem : otherSectionItem;
            });
        } else {
            // New entry -> Append to array of entries
            newOtherSectionHistory = [...otherSection, addedOtherItem];
            setOrder([...order, idCounter]);
            setIdCounter(idCounter + 1);
        }

        setOtherSection(newOtherSectionHistory);

        setTitle('');
        setLink('');
        setDetailsList([]);
        setEditingId(null);
        e.target.reset();
    };

    const handleEdit = (entry: OtherItem) => {
        setTitle(entry.title);
        setLink(entry.link);
        setDetailsList(entry.detailsList);

        setEditingId(entry.id);
    };

    const reorderUp = (entry: OtherItem) => {
        const currentPos = order.indexOf(entry.id ?? -1);

        // Already first item in order array
        if (currentPos <= 0) {
            return;
        }

        const newOrder = [...order];
        newOrder.splice(currentPos, 1);
        newOrder.splice(currentPos - 1, 0, entry.id ?? -1);

        setOrder(newOrder);
        sortOtherSection(otherSection, newOrder);
    };

    const reorderDown = (entry: OtherItem) => {
        const currentPos = order.indexOf(entry.id ?? -1);

        // Already last item in order array
        if (currentPos === order.length - 1) {
            return;
        }

        const newOrder = [...order];
        newOrder.splice(currentPos, 1);
        newOrder.splice(currentPos + 1, 0, entry.id ?? -1);

        setOrder(newOrder);
        sortOtherSection(otherSection, newOrder);
    };

    return (
        <>
            <details>
                <summary className="flex flex-col p-2 text-2xl font-semibold text-center border-t border-regent-st-blue-400 bg-regent-st-blue-500 text-regent-st-blue-50 md:text-left hover:cursor-pointer hover:bg-regent-st-blue-600 active:bg-regent-st-blue-700">
                    {formType === 'skills' ? 'Skills' : 'Projects'}
                </summary>
                <div className="p-4 bg-regent-st-blue-100 text-regent-st-blue-950">
                    <form className="flex flex-col" onSubmit={handleOtherItemAdd}>
                        <div className="mt-2 flex flex-row gap-2 items-center">
                            <label htmlFor="titleInput" className="font-semibold">
                                {formType === 'skills' ? 'Skill Category' : 'Project Title'}
                            </label>
                            {formType === 'skills' && (
                                <div>
                                    <a
                                        href="#titleInput"
                                        aria-describedby="skillsCategoryTooltip"
                                        data-tooltip-id="skillsCategoryTooltip"
                                        data-tooltip-wrapper="div"
                                        data-tooltip-html="Suggested categories for <u>software developers</u>:</br>Languages, Tools, Non-Technical Skills. <br/><br/>General list of categories to select from:</br>Technical Skills, Non-Technical/Soft Skills, Certifications/Licenses, Creative Skills, Research Skills, Analytical Skills, Legal/Regulatory Knowledge, Spoken/Written Languages. </br></br>Advice: Limit to maximum 3 categories for conciseness."
                                        data-tooltip-place="top"
                                    >
                                        <TooltipIcon className="max-w-6 max-h-6" />
                                    </a>
                                    <Tooltip id="skillsCategoryTooltip" className="max-w-[70%] md:max-w-[20%]" />
                                </div>
                            )}
                        </div>

                        <input
                            type="text"
                            className="outline-regent-st-blue-400 border border-regent-st-blue-400 rounded-md p-1 mt-1"
                            id="titleInput"
                            name="titleInput"
                            placeholder={formType === 'skills' ? 'Enter skill category' : 'Enter project title'}
                            value={title || ''}
                            onChange={(e) => setTitle(e.target.value)}
                        ></input>
                        {formType === 'projects' && (
                            <>
                                <div className="flex gap-2 mt-2">
                                    <label htmlFor="linkInput" className="font-semibold">
                                        Project URL
                                    </label>
                                </div>

                                <input
                                    type="text"
                                    className="outline-regent-st-blue-400 border border-regent-st-blue-400 rounded-md p-1 mt-1"
                                    id="linkInput"
                                    name="linkInput"
                                    placeholder="Enter your project URL"
                                    value={link || ''}
                                    onChange={(e) => setLink(e.target.value)}
                                ></input>
                            </>
                        )}

                        <CustomiserItemDetailsList
                            detailsList={detailsList}
                            handleDetailsListAdd={handleDetailsListAdd}
                            formType={formType}
                        />
                        <button
                            type="submit"
                            className="border text-lg font-semibold text-center rounded-md w-fit mt-4 ml-auto px-4 py-2 text-regent-st-blue-50 bg-regent-st-blue-500 hover:bg-regent-st-blue-600 active:bg-regent-st-blue-700 hover:cursor-pointer"
                        >
                            {editingId !== null ? 'Save Entry' : 'Add Entry'}
                        </button>
                    </form>
                </div>
                <div className="bg-gray-200 flex flex-col divide-y divide-regent-st-blue-400 border-t border-regent-st-blue-400">
                    {isArrayFilled &&
                        otherSection.map((otherSectionItem) => (
                            <CustomiserOtherPreviousEntries
                                key={otherSectionItem.id}
                                entry={otherSectionItem}
                                fullList={otherSection}
                                updaterFn={setOtherSection}
                                editHandler={handleEdit}
                                order={order}
                                setOrder={setOrder}
                                reorderUp={reorderUp}
                                reorderDown={reorderDown}
                            />
                        ))}
                </div>
            </details>
        </>
    );
};

export default CustomiserOther;
