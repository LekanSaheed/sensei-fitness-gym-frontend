"use client";

import Button from "@/components/button";
import DialogModal from "@/components/dialog-modal";
import Input from "@/components/input";
import Modal from "@/components/Modal";
import SectionLoader from "@/components/SectionLoader";
import SheetModal from "@/components/sheet-modal";
import Table, { ColumnProps } from "@/components/table";
import { ItemMedia } from "@/components/ui/item";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import usePermissions, { Permission } from "@/hooks/usePermissions";
import useStateReducer from "@/hooks/useStateReducer";
import {
  useGetAdminsQuery,
  useGetInvitationsQuery,
  useInviteAdminMutation,
  useResendInviteNotificationMutation,
} from "@/redux/api-slices/admin.slice";
import { ErrorResponse } from "@/types";
import {
  collocateMemberName,
  isFetchBaseQueryError,
  onlyFieldsWithValue,
} from "@/utils";
import { Copy, Refresh2, Send2 } from "iconsax-react";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import React, { FunctionComponent } from "react";
import toast from "react-hot-toast";
import { MdOutlineDelete } from "react-icons/md";

const AccessControl = () => {
  const searchParams = useSearchParams();

  const { isError, isLoading, isFetching, data, refetch } = useGetAdminsQuery(
    onlyFieldsWithValue({ search: searchParams.get("searchQuery") || "" })
  );

  const columns: ColumnProps[] = [
    { label: "Admin Name", field: "adminName" },
    { label: "Email", field: "email" },
    { label: "Number of Permissions", field: "numberOfPermissions" },
    { label: "Date Created", field: "createdAt", fieldType: "date" },
  ];

  const admins = data?.data || [];

  const { state, handleStateChange } = useStateReducer({
    inviteModal: false,
    adminModal: false,
  });
  return (
    <div>
      <Table
        columns={columns}
        totalRecords={admins.length}
        loading={isLoading || isFetching}
        error={isError}
        refetch={refetch}
        rows={admins.map((admin, id) => {
          return {
            ...admin,
            id,
            adminName: `${collocateMemberName(admin)}`,
            numberOfPermissions: (admin?.permissions || []).length,
          };
        })}
        customNode={
          <>
            <SheetModal
              title="Sent Invitations"
              description="The list of sent invitations to admin personnels"
              trigger={
                <Button
                  size="sm"
                  label="View Sent Invitations"
                  color="black"
                  permissions={["invite_admin"]}
                  variant="outlined"
                />
              }
            >
              <SentInvites />
            </SheetModal>
            <SheetModal
              title="Invite Admin"
              description="Type the email address of the person you want to invite as an admin"
              trigger={
                <Button
                  onClick={() => handleStateChange({ inviteModal: true })}
                  permissions={["invite_admin"]}
                  label="Invite Admin"
                  color="black"
                  size="sm"
                />
              }
            >
              <InviteAdmin />
            </SheetModal>
          </>
        }
      />
    </div>
  );
};

const SentInvites = () => {
  const { isError, isLoading, isFetching, data, refetch } =
    useGetInvitationsQuery(null);

  const invitations = data?.data || [];

  return (
    <div>
      <SectionLoader
        loading={isLoading || isFetching}
        error={isError}
        refetch={refetch}
      />

      <div className="max-h-[80vh] overflow-auto border border-gray-400 rounded-[10px] p-2">
        <table className="w-full text-[14px]">
          {/* <thead>
            <tr className="[&>th]:font-normal  [&>th]:py-1 [&>th]:text-start">
              <th>Email</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead> */}
          <tbody>
            {invitations.map((invitation, id) => {
              return (
                <tr
                  key={id}
                  className="text-[12px] [&>td]:py-1.5 [&>td]:px-2 [&>td]:border-b last:[&>td]:border-b-0
                   last:[&>td]:!pb-0 [&>td]:border-b-gray-400"
                >
                  <td>{invitation?.email}</td>
                  <td
                    className={`capitalize ${
                      invitation?.status === "completed"
                        ? "text-emerald-600"
                        : "text-gray-600"
                    }`}
                  >
                    <div className="flex">
                      {" "}
                      <span className="text-[11px]"> {invitation?.status}</span>
                      {invitation?.status === "pending" && (
                        <ResendNotification id={invitation._id} />
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap">
                    <ItemMedia
                      variant={"icon"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (invitation.status === "completed") return;
                      }}
                    >
                      <MdOutlineDelete />
                    </ItemMedia>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ResendNotification = ({ id }: { id: string }) => {
  const [resend, resendStatus] = useResendInviteNotificationMutation();

  const resendNote = async () => {
    const res = await resend({ id });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error?.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res?.data;

      if (response?.success) {
        toast.success("Notification resent");
      } else {
        toast.error(response?.message || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  return (
    <span onClick={() => resendNote()} title="Resend Invitation">
      {resendStatus.isLoading ? (
        "..."
      ) : (
        <Send2
          color="var(--color-gray-700)"
          className="ml-1 cursor-pointer hover:!text-default"
          size={15}
        />
      )}
    </span>
  );
};
const InviteAdmin: FunctionComponent = () => {
  const { error, loading, permissions, refetch } = usePermissions();

  const { handleStateChange, state } = useStateReducer<{
    email: string;
    selectedPermissions: Permission[];
  }>({
    email: "",
    selectedPermissions: [],
  });

  console.log(state.selectedPermissions);

  const [invite, inviteStatus] = useInviteAdminMutation();

  const inviteAdmin = async () => {
    const res = await invite({
      email: state.email,
      permissions: state.selectedPermissions,
    });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error?.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res?.data;

      if (response?.success) {
        toast.success("Admin Invitation sent successfully");

        handleStateChange({ email: "", selectedPermissions: [] });
      } else {
        toast.error(response?.message || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (state.selectedPermissions.length < 1) {
          return toast.error("Please select at least one permission");
        }
        inviteAdmin();
      }}
    >
      <Input
        required
        label={"Email address"}
        type="email"
        inputMode="email"
        placeholder="Email address of the invitee"
        value={state.email}
        onChange={(e) => handleStateChange({ email: e.target.value })}
      />
      <div>
        <h2 className="font-semibold text-gray-900 z-[2] text-[12px] pb-3 bg-white sticky top-[0px]">
          Select what this admin can access
        </h2>
        <SectionLoader loading={loading} error={error} refetch={refetch} />
        <ul>
          {permissions.map((permission, id) => {
            const checked = state.selectedPermissions.includes(permission.name);

            const disabled =
              state.selectedPermissions.includes("super_user") &&
              permission.name !== "super_user";

            return (
              <li
                aria-disabled={disabled}
                key={id}
                className="flex transition aria-disabled:pointer-events-none aria-disabled:bg-gray-100 aria-disabled:text-gray-500 justify-between px-4 items-center rounded-[5px] py-2 border mb-2 "
              >
                <div>
                  <h1 className="font-semibold text-[14px]">
                    {" "}
                    {permission.name}
                  </h1>
                  <p className="text-gray-500 text-[12px]">
                    {permission.description}
                  </p>
                </div>
                <div>
                  <Switch
                    onCheckedChange={() => {
                      if (checked) {
                        handleStateChange({
                          selectedPermissions: state.selectedPermissions.filter(
                            (p) => p !== permission.name
                          ),
                        });
                      } else {
                        if (permission.name === "super_user") {
                          return handleStateChange({
                            selectedPermissions: ["super_user"],
                          });
                        }
                        handleStateChange({
                          selectedPermissions: [
                            ...state.selectedPermissions,
                            permission.name,
                          ],
                        });
                      }
                    }}
                    checked={checked || disabled}
                    disabled={disabled}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="sticky bottom-0">
        <Button
          type="submit"
          loading={inviteStatus.isLoading}
          label="Invite"
          fullWidth
          color="black"
        />
      </div>
    </form>
  );
};
export default AccessControl;
