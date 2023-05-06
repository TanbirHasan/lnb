import React, {useEffect} from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { formStateRecoil } from '../../../store/atoms/formStateRecoil';
import { companyListRecoilState } from '../../../store/atoms/companyListRecoil';
import { senderDataRecoil } from '../../../store/atoms/senderDataRecoil';
import apiClient from '../../../library/apis/api-client';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Tooltip } from '@mui/material';
import { ConvertToContString } from '../../../library/utils/contString';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EmailTemplateRenderer from './EmailTemplate';

function Preview({setEmailBodyHtml}) {
  const templateStrings = useRecoilValue(formStateRecoil);

//  console.log("templateString",templateStrings)
  const body = templateStrings.step_three;
  const subject = templateStrings.emailSubject;

  return (
	  <div className="w-full">
		<PreviewPaper subject={ subject } setEmailBodyHtml={setEmailBodyHtml} body={ body }/>
	  </div>
  );
}

function PreviewPaper({ subject, body, setEmailBodyHtml }) {
  const [apiLoading, setApiLoading] = React.useState(false);
  const [companyData, setCompanyData] = React.useState();

  const [senderData, setSenderdata] = useRecoilState(senderDataRecoil);
  const [companyList, setcompanyList] = useRecoilState(companyListRecoilState);
	const [templateString, setTemplateString] = useRecoilState(formStateRecoil);
  const [senderInfoData, setSenderInfoData] = React.useState();

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
	getCompanyList().then((r) => r);
	getSenderInfo().then((r) => r);
  }, [companyList, senderData]);

  const emailHtml = React.useMemo(() => EmailTemplateRenderer({
		subject: subject,
		senderData: senderData,
		senderInfoData: senderInfoData,
		mailBody: body,
	  },
  ), [subject, body, senderData, senderInfoData]);

	setEmailBodyHtml(emailHtml)

  const getCompanyList = async () => {
	if (!!companyList) {
	  const companyArray = {
		list: companyList,
	  };
	  try {
		setApiLoading(true);
		const res = await apiClient.post(
			`${ process.env.NEXT_PUBLIC_API_BASE_URL }/company/list/getCompanyListFromList/?limit=5000`,
			companyArray,
		);
		if (res.status === 200) {
		  const dataRows = res?.data?.companyData.map((row) => ({
			id: row?._id,
			companyName:
				row?.company_name.charAt(0).toUpperCase() +
				row?.company_name.slice(1).toLowerCase(),
			companyNumber: row?.company_number,
			type: row?.company_type,
			city: row?.registered_office_address?.locality,
			postcode: row?.company_data?.registered_office_address?.postal_code,
			status: row?.company_status,
		  }));

		  setCompanyData(dataRows);
		  setApiLoading(false);
		} else {
		  getCompanyList();
		}
	  } catch (e) {
		console.log(e);
	  }
	}
  };

  const getSenderInfo = async () => {
	if (!!senderData) {
	  try {
		const res = await apiClient.get(
			`${ process.env.NEXT_PUBLIC_API_BASE_URL }/sendersData/getSendersData`,
		);
		if (res.status === 200) {
		  const selectedData = res?.data?.filter(
			  (item) => item?.companyName === senderData.companyName,
		  );

		  setSenderInfoData(selectedData);
		}
	  } catch (e) {
		console.log(e);
	  }
	}
  };

  const onDeleteHandeller = (companyId) => {
	if (companyList.length > 1) {
	  const newList = companyList.filter((id) => id !== companyId);
	  setcompanyList(newList);
	  enqueueSnackbar('Removed Successfully', { variant: 'success' });
	} else {
	  enqueueSnackbar('Must have at least one company', { variant: 'error' });
	}
  };

  return (
	  <div>
		<div className="grid grid-cols-1 md:grid-cols-5 px-2 gap-4">
		  <div className="col-span-1 md:col-span-2 shadow-lg p-5">
			{ !companyData && (
				<Box className="flex justify-center my-5">
				  <CircularProgress/>
				</Box>
			) }
			{ !!companyData && (
				<div>
				  <div className="text-xl text-gray-500 mb-2">
					You have selected { companyData?.length } companies.
				  </div>
				  <div
					  className="h-[60vh] overflow-y-auto overflow-x-hidden custom-scrollbar">
					{ companyData.map((company, index) => {
					  return (
						  <div
							  key={ company?.id }
							  className="p-3 border-2 border-gray-300 rounded-md my-2 cursor-pointer flex items-center justify-between mr-1"
						  >
							<div className="flex items-center gap-1">
							  <div>{ index + 1 }.</div>
							  <Tooltip title={ company.companyName }>
								<div className="font-medium">
								  { ConvertToContString(company.companyName,
									  30) }
								</div>
							  </Tooltip>
							  <Tooltip
								  title={
									company.status === 'active' ?
										'Active' :
										'Disable'
								  }
							  >
								<FiberManualRecordIcon
									className={ `h-4 w-4 ${
										company.status === 'active'
											? 'text-green-600'
											: 'text-red-600'
									}` }
								/>
							  </Tooltip>
							</div>
							<IconButton
								aria-label="delete"
								size="small"
								color="error"
								onClick={ () => {
								  onDeleteHandeller(company.companyNumber);
								} }
							>
							  <DeleteIcon fontSize="inherit"/>
							</IconButton>
						  </div>
					  );
					}) }
				  </div>
				</div>
			) }
			<div></div>
		  </div>
		  <div className='overflow-x-scroll col-span-1 md:col-span-3 flex-col justify-start shadow-lg border-2 border-gray-100'>
		  <div
			  className="  min-h-[78vh]  w-[900px]">
			<div className="bg-[#19253F] p-2 relative">
			  <div
				  className="bg-[#00B3C6] p-2 absolute right-0 min-w-[180px] rounded-b-full rounded-r-none  mt-2"></div>
			</div>
			<div dangerouslySetInnerHTML={ { __html: emailHtml } }/>
		  </div>

		  </div>

		 

		</div>

	  </div>
  );
}

export default Preview;
